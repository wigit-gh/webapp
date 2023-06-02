package handlers

import (
	"errors"

	"github.com/gin-gonic/gin"
)

var (
	// ErrEmailNotProvided indicates email not provided during signin.
	ErrEmailNotProvided = errors.New("Email required")
	// ErrInvalidUser indicates the user does not exist during signin.
	ErrInvalidUser = errors.New("Invalid Email")
	// ErrInternalServer indicates some server side error occured that can't be handled.
	ErrInternalServer = errors.New("Something went wrong!")
	// ErrFailedToAddUserToDB indicates that an error occured when adding user to database.
	ErrFailedToAddUserToDB = errors.New("Failed to add user to database")
	// ErrDuplicateUser indicates that User with email already exists during signup.
	ErrDuplicateUser = errors.New("User with email already exists")
	// ErrInvalidFirstName indicates no First Name was provided for user on sign up.
	ErrInvalidFirstName = errors.New("Valid First Name required")
	// ErrInvalidLastName indicates no Last Name was provided for user on sign up.
	ErrInvalidLastName = errors.New("Valid Last Name required")
	// ErrInvalidAddress indicates no Address was provided for user on sign up.
	ErrInvalidAddress = errors.New("Valid Address required")
	// ErrNoPhone indicates no Phone number was provided for user on sign up.
	ErrNoPhone = errors.New("Valid Phone required")
	// ErrInvalidPhone indicates wrong number of digits were passed for user on sign up.
	ErrInvalidPhone = errors.New("Invalid number of digits in Phone field")
	// ErrInvalidPass indicates the user did not provide a Password on sign up or a valid password on signin.
	ErrInvalidPass = errors.New("Valid Password required")
	// ErrPassMismatch indicates the user entered did not repeat the password correctly.
	ErrPassMismatch = errors.New("Password Mismatch")
	// ErrPassTooShort indicates the user entered a password less than 8 characters long on sign up.
	ErrPassTooShort = errors.New("Password must be at least 8 characters long")
	// ErrPassTooLong indicates the user entered a password longer than 45 characters during sign up.
	ErrPassTooLong = errors.New("Password must not exceed 45 characters")
	// ErrInvalidProductID indicates that the id provided is invalid.
	ErrInvalidProductID = errors.New("Invalid Product ID")
	// ErrInvalidCategory indicates that the category of products provided is invalid.
	ErrInvalidCategory = errors.New("Not a valid category")
	// ErrInvalidServiceID indicates the service specified by the given ip does not exist.
	ErrInvalidServiceID = errors.New("Not a valid service")
	// ErrInvalidSlotID indicates that not slot id was provided or the slot id provided is not valid.
	ErrInvalidSlotID = errors.New("Slot ID is not valid")
	// ErrEmailParamNotSet indicates an email param is needed and was not provided.
	ErrEmailParamNotSet = errors.New("email param not set")
	// ErrUserCtx indicates the user is not set in the current context.
	ErrUserCtx = errors.New("User not set in context")
	// ErrStatusCtx indicates the status is not set in the current context.
	ErrStatusCtx = errors.New("Status not set")
)

// AbortCtx ends the current context with status.
func AbortCtx(ctx *gin.Context, responseCode int, err error) {
	ctx.AbortWithStatusJSON(responseCode, err.Error())
}
