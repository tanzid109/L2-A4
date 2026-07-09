# RentNest 🏠

## Database Diagram
https://drawsql.app/teams/tanzid/diagrams/l2a4

## Backend Live 
backend= https://rentnest-ecru.vercel.app

**"Find & List Rental Properties with Ease"**

A backend API for a rental property marketplace where landlords can list properties, tenants can browse and request rentals, and admins oversee the platform.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Payment**: Stripe
- **Other**: cors, cookie-parser, http-status

## Features

### Public
- Browse all rental properties with filters (location, price, category, status)
- View detailed property listings
- View property categories

### Tenant
- Register and login
- Submit rental requests
- Make payments via Stripe after approval
- View payment history
- View rental request history
- Leave reviews after completed rentals

### Landlord
- Register and login
- Create, edit, and delete property listings
- Set property availability status
- Approve or reject rental requests
- View rental history and tenant reviews

### Admin
- View all users (ban/unban)
- View all properties
- View all rental requests
- Manage property categories

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/me` - Get current user profile

### Properties
- `GET /api/property` - Get all properties (with filters: city, category, minPrice, maxPrice, status)
- `GET /api/property/:id` - Get property details

### Landlord
- `POST /api/landlord/properties` - Create property
- `GET /api/landlord/properties/my-properties` - Get my properties
- `GET /api/landlord/properties/:id` - Get property by id
- `PUT /api/landlord/properties/:id` - Update property
- `DELETE /api/landlord/properties/:id` - Delete property

### Rental Requests
- `POST /api/rentals/:id` - Submit rental request (tenant)
- `GET /api/rentals/my-requests` - Get my requests (tenant)
- `GET /api/rentals/landlord` - Get landlord requests
- `PATCH /api/rentals/landlord/:id` - Approve/reject request

### Payments
- `POST /api/payments/create/:rentalRequestId` - Create Stripe payment session
- `POST /api/payments/webhook` - Stripe webhook handler
- `GET /api/payments/success` - Payment success callback
- `GET /api/payments` - Get payment history
- `GET /api/payments/:id` - Get payment details

### Reviews
- `POST /api/reviews/:propertyId` - Create review (tenant)
- `GET /api/reviews` - Get all reviews

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get single user
- `PATCH /api/admin/users/:id` - Update user status (ban/unban)
- `GET /api/admin/rentals` - Get all rentals
- `GET /api/admin/rentals/:id` - Get single rental
- `GET /api/admin/properties` - Get all properties

### Categories
- `POST /api/category` - Create category (admin/landlord)
- `GET /api/category` - Get all categories
- `GET /api/category/:id` - Get single category
- `PUT /api/category/:id` - Update category
- `DELETE /api/category/:id` - Delete category

## Database Schema

- **Users** - User info, auth details, role (TENANT/LANDLORD/ADMIN)
- **Properties** - Rental listings with landlord and category
- **Categories** - Property types (apartment, house, studio, etc.)
- **RentalRequests** - Rental requests with status flow
- **Payments** - Payment transactions (Stripe)
- **Reviews** - Tenant reviews for properties