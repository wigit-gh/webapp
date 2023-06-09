package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/wigit-ng/webapp/backend/internal/api/v1/handlers"
)

// SignInRoutes add all routes in the signin endpoint.
func SignInRoutes(api *gin.RouterGroup) {
	api.POST("/signin", handlers.SignIn)
}
