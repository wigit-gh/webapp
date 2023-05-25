package models

import (
	"time"

	"github.com/shopspring/decimal"
)

// BaseModel is the model in which all other models inherit from.
// It defines the primary fields for all models.
type BaseModel struct {
	// ID is the unique identifier for this object.
	ID *string `gorm:"primaryKey;type:varchar(45)" json:"id"`
	// CreatedAt is the time in which the object was created in the database.
	CreatedAt *time.Time `gorm:"not null;type:datetime;default:CURRENT_TIMESTAMP" json:"created_at"`
	// UpdatedAt is the last datetime at which the object was updated.
	UpdatedAt *time.Time `gorm:"not null;type:datetime;default:CURRENT_TIMESTAMP" json:"updated_at"`
}

// User models a unique user in the database.
type User struct {
	BaseModel
	FirstName *string `gorm:"not null;type:varchar(45)" json:"first_name"`
	LastName  *string `gorm:"not null;type:varchar(45)" json:"last_name"`
	Address   *string `gorm:"not null;type:varchar(255)" json:"address"`
	Phone     *string `gorm:"not null;type:varchar(11)" json:"phone"`

	// Email is the unique email for this user.
	Email *string `gorm:"unique;not null;type:varchar(45)" json:"email" binding:"required,email,min=5,max=45"`

	// Password is the password entered by the user during signup or signin.
	// It is not stored in the database.
	Password *string `gorm:"-" json:"password"`

	RepeatPassword *string `gorm:"-" json:"repeat_password"`

	// ResetToken is used to validate the user to allow them reset their password.
	ResetToken string `gorm:"type:varchar(16)" json:"-"`

	// This is the hashed version of `Password`, using bcrypt and `Salt`.
	HashedPassword []byte `gorm:"not null;type:blob" json:"-"`

	// Salt is a random set of bytes used to garnish the password before hashing for added security.
	Salt []byte `gorm:"not null;type:blob" json:"-"`

	// Role is the user's role in the company. Can either be `customer` or `admin`.
	Role *string `gorm:"not null;type:varchar(45);default:'customer'" json:"role"`

	// Orders is a list of all Orders owned by this user.
	// Creates a one-to-many relation with orders table.
	Orders []Order `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"orders"`

	// Bookings is a list of Bookings owned by this User.
	// Creates a one-to-many relationship with bookings table.
	Bookings []Booking `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"bookings"`
}

// Order represents an order which belongs to a unique user.
type Order struct {
	BaseModel

	// Order instance belongs to User with UserID
	// User User `json:"-"`

	// UserID is used to find User instance to fill info for above user.
	// UserID is implicitly used as a foreignKey.
	UserID *string `gorm:"not null;" json:"user_id"`

	// Items is a list of all items making up the order.
	// Creates a one-to-many relationship with the Items table.
	Items []Item `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"items"`

	// This is the overall amount of all items in the order.
	TotalAmount *decimal.Decimal `gorm:"not null;type:decimal(10,2)" json:"total_amount"`

	// DeliveryMethod is the method in which order items are to be deliverd.
	// Values are `shipping` or `pickup`.
	DeliveryMethod *string `gorm:"not null;type:varchar(45);" json:"delivery_method"`

	// This is the status of the order. Values are `pending`, `paid`, `shipped`, `delivered`.
	Status *string `gorm:"not null;type:varchar(45);default:'pending'" json:"status"`
}

// Product represents a unique product sold by the company.
type Product struct {
	BaseModel

	// Name is the name of the Product.
	Name *string `gorm:"not null;unique;type:varchar(45)" json:"name" binding:"required,min=3,max=45"`

	// Description is a detailed description of the Product.
	Description *string `gorm:"not null;type:varchar(1024)" json:"description" binding:"required,min=3,max=45"`

	// Category is what group the Product belongs to.
	// Values are ...
	Category *string `gorm:"not null;type:varchar(45)" json:"category" binding:"required,min=3,max=45"`

	// Stock is the number of the product available.
	Stock *int `gorm:"not null;type:int" json:"stock" binding:"required"`

	// Price is the value of one unit of the Product.
	Price *decimal.Decimal `gorm:"not null;type:decimal(10,2)" json:"price" binding:"required"`

	// ImageURL is a link to a stock photo of the product.
	ImageURL *string `gorm:"not null;type:varchar(128)" json:"image_url" binding:"required,max=128"`
}

// Item is an instance of a Product within an Order.
type Item struct {
	BaseModel

	// OrderID is the id of the order the item belongs to. It is autofilled when
	// an item is appended to an order's Items list and saved to the database and serves as a
	// foreignKey.
	OrderID *string `json:"order_id"`

	// UserID is the id of the user to which the item in a order belongs.
	UserID *string `json:"-"`

	Product Product `json:"-" binding:"-"`
	// ProductID is used to is the id for which this item is an instance.
	ProductID *string `gorm:"not null;type:varchar(45)" json:"product_id"`

	// Quantity is the number of the item ordered. Must not be more than Product in stock.
	Quantity *int `gorm:"not null" json:"quantity"`

	// Amount is the result of the Product price times the Quantity of the item ordered.
	Amount *decimal.Decimal `gorm:"not null;type:decimal(10,2)" json:"amount"`
}

// Booking represents a booking of a service for a given user.
type Booking struct {
	BaseModel

	// UserID is the ID for the user who has this booking.
	UserID *string `gorm:"not null" json:"user_id"`

	// Slot is the time associated with this booking.
	Slot   Slot    `json:"slot" binding:"-"`
	SlotID *string `gorm:"not null;" json:"slot_id" binding:"required"`

	// Service is the service for which this booking has been made.
	Service   Service `json:"service" binding:"-"`
	ServiceID *string `gorm:"not null" json:"service_id" binding:"required"`

	// Amount is the cost of the service.
	Amount *decimal.Decimal `gorm:"not null" json:"amount"`

	// Status is the current status of the booking.
	// Values are `pending`, `paid`, `fulfilled`, `cancelled`.
	Status *string `gorm:"not null;type:varchar(45);default:'pending'" json:"status"`
}

// Slot represents a datetime for a booking.
type Slot struct {
	BaseModel

	// DateTime is the date and time for which the slot has been allocated.
	DateTime *time.Time `gorm:"not null;type:datetime" json:"date_time" binding:"required"`

	// IsFree says if the slot has been taken or not.
	IsFree *bool `gorm:"not null" json:"is_free" binding:"required"`
}

// Service represents a service offered by the company.
type Service struct {
	BaseModel

	// Name is the name of the service.
	Name *string `gorm:"not null;unique;type:varchar(45)" json:"name" binding:"required,min=3,max=45"`

	// Description is a brief description of the service.
	Description *string `gorm:"not null;type:varchar(1024)" json:"description" binding:"required,min=5,max=1024"`

	// Price is the cost of the service.
	Price *decimal.Decimal `gorm:"not null;type:decimal(10,2)" json:"price"`

	// Available says whether the service is available or not.
	Available *bool `gorm:"not null" json:"available" binding:"required"`
}
