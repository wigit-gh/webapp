package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/cristalhq/jwt/v5"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/wigit-gh/webapp/internal/api/v1/middlewares"
	"github.com/wigit-gh/webapp/internal/db"
	"github.com/wigit-gh/webapp/internal/db/models"
	"gorm.io/gorm"
)

// JWTAuthentication validates a user's signin JWT token set in the `Authorization` header.
func JWTAuthentication(ctx *gin.Context) {
	authHeader := ctx.GetHeader("Authorization")
	if authHeader == "" {
		ctx.Header(`WWW-Authenticate`, `Bearer realm="Restricted"`)
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
		return
	}

	bearerToken := strings.Split(authHeader, " ")
	if len(bearerToken) != 2 {
		ctx.Header(`WWW-Authenticate`, fmt.Sprintf(
			`Bearer realm="Restricted", error="invalid_token", error_description="Invalid Authorization header format"`,
		))
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid Authorization header format"})
		return
	}

	if bearerToken[0] != "Bearer" {
		ctx.Header(`WWW-Authenticate`, fmt.Sprintf(
			`Bearer realm="Restricted", error="invalid_token", error_description="Authorization value does not contain Bearer"`,
		))
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization value does not contain Bearer"})
		return
	}

	userID, err := validateJWTToken(bearerToken[1])
	if err != nil {
		ctx.Header(`WWW-Authenticate`, fmt.Sprintf(
			`Bearer realm="Restricted", error="invalid_token", error_description="%s"`, err.Error(),
		))
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	user, err := getUserByID(userID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.Set("user", user)
	ctx.Next()
}

// validateJWTToken checks the validity of the jwt token provided.
// It returns the user ID stored in the claims, and any error if any occurs.
func validateJWTToken(_token string) (string, error) {
	token, err := parseToken(_token)
	if err != nil {
		return "", err
	}

	claims, err := retrieveTokenClaims(token)
	if err != nil {
		return "", err
	}

	if !claims.IsValidAt(time.Now().UTC()) {
		return "", errors.New("Token has expired")
	}

	return claims.ID, nil
}

// parseToken takes a token as a string and verify the signature.
// It returns the parsed token as a pointer to a jwt.Token object.
func parseToken(_token string) (*jwt.Token, error) {
	token, err := jwt.Parse([]byte(_token), middlewares.JWTVerifier)
	if err != nil {
		return nil, errors.New("failed to parse JWT token")
	}

	return token, nil
}

// retrieveTokenClaims return the claims stored in a token and any error.
func retrieveTokenClaims(token *jwt.Token) (*jwt.RegisteredClaims, error) {
	claims := new(jwt.RegisteredClaims)
	if err := json.Unmarshal(token.Claims(), claims); err != nil {
		return nil, errors.New("failed to Unmarshal claims")
	}

	return claims, nil
}

// getUserByID gets the user with `email` from the database.
func getUserByID(id string) (*models.User, error) {
	dbUser := new(models.User)

	if _, err := uuid.Parse(id); err != nil {
		return nil, errors.New("ID not a valid uuid")
	}

	if err := db.Connector.Query(func(tx *gorm.DB) error {
		return tx.First(dbUser, "id = ?", id).Error
	}); err != nil && errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("No user with given ID")
	} else if err != nil {
		return nil, errors.New("Something went wrong!")
	}

	return dbUser, nil
}

// Authorization validates if the user has admin privileges or not.
func AdminAuthorization(ctx *gin.Context) {
	_user, exists := ctx.Get("user")
	if !exists {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "User not set in context"})
		return
	}

	user, ok := _user.(*models.User)
	if !ok {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": ErrInternalServer.Error()})
		return
	}

	if *user.Role != "admin" && *user.Role != "super_admin" {
		err := "You are not allowed to view this resource"
		ctx.Header(`WWW-Authenticate`, fmt.Sprintf(
			`Bearer realm="Restricted", scope="admin super_admin", error="insufficient_scope", error_description="%s"`, err,
		))
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": err})
		return
	}

	ctx.Next()
}

// SuperAdminAuthorization validates if the user is the super admin.
func SuperAdminAuthorization(ctx *gin.Context) {
	_user, exists := ctx.Get("user")
	if !exists {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "User not set in context"})
		return
	}

	user, ok := _user.(*models.User)
	if !ok {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": ErrInternalServer.Error()})
		return
	}

	if *user.Role != "super_admin" {
		err := "You are not allowed to view this resource"
		ctx.Header(`WWW-Authenticate`, fmt.Sprintf(
			`Bearer realm="Restricted", scope="super_admin", error="insufficient_scope", error_description="%s"`, err,
		))
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": err})
		return
	}

	ctx.Next()
}
