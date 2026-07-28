# EstateNexus REST API Documentation

Comprehensive documentation of all RESTful API endpoints, request schemas, authentication requirements, and response structures.

## Base URL
`http://localhost:5001/api`

---

## Authentication Endpoints (`/api/auth`)

### 1. Register New User
- **POST** `/auth/register`
- **Request Body**:
  ```json
  {
    "name": "Emily Blunt",
    "email": "buyer@estate.com",
    "password": "buyer123",
    "role": "buyer", // 'buyer' | 'seller' | 'agent'
    "phone": "+1 (555) 987-6543",
    "bio": "Active buyer looking for villas"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "Registration successful",
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": { "id": 5, "name": "Emily Blunt", "email": "buyer@estate.com", "role": "buyer" }
  }
  ```

### 2. User Login
- **POST** `/auth/login`
- **Request Body**:
  ```json
  {
    "email": "admin@estate.com",
    "password": "admin123"
  }
  ```
- **Response (200 OK)**: Returns JWT bearer token and user profile object.

### 3. Get Current User Profile
- **GET** `/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: Returns user profile without password hash.

---

## Property Endpoints (`/api/properties`)

### 1. Get & Search Properties
- **GET** `/properties`
- **Query Parameters**:
  - `keyword` (string): Search in title, address, description, postcode
  - `city` (string): Filter by city
  - `property_type` (House | Apartment | Villa | Penthouse | Office)
  - `listing_type` (Sale | Rent)
  - `minPrice` / `maxPrice` (number)
  - `bedrooms` / `bathrooms` (number)
  - `sort` (newest | oldest | price_low | price_high | area_largest | most_popular)
  - `page` (number, default: 1)
  - `limit` (number, default: 12)
- **Response (200 OK)**:
  ```json
  {
    "properties": [ ... ],
    "totalCount": 8,
    "page": 1,
    "totalPages": 1
  }
  ```

### 2. Get Property Details
- **GET** `/properties/:id`
- **Response (200 OK)**: Returns complete property breakdown including image gallery array, amenities list, owner/agent contact details, and view count increment.

### 3. Create Property Listing
- **POST** `/properties`
- **Headers**: `Authorization: Bearer <token>` (Role: `seller`, `agent`, `admin`)
- **Request Body**:
  ```json
  {
    "title": "Grand Horizon Villa",
    "property_type": "Villa",
    "listing_type": "Sale",
    "price": 2450000,
    "address": "742 Coastal Ridge Blvd",
    "city": "Malibu",
    "postcode": "90265",
    "bedrooms": 5,
    "bathrooms": 6,
    "area_sqft": 6200,
    "images": ["https://images.unsplash.com/..."],
    "amenities": [1, 2, 4, 5]
  }
  ```

### 4. Moderate Property Status
- **PATCH** `/properties/:id/status`
- **Headers**: `Authorization: Bearer <token>` (Role: `admin` or Property Owner)
- **Request Body**: `{ "status": "active" }` // active | pending | sold | rented | inactive | rejected

---

## Enquiry & Favourites Endpoints

### 1. Submit Property Enquiry
- **POST** `/enquiries`
- **Request Body**:
  ```json
  {
    "property_id": 1,
    "sender_name": "Emily Blunt",
    "sender_email": "buyer@estate.com",
    "sender_phone": "+1 (555) 987-6543",
    "message": "Hi, I am interested in viewing this property."
  }
  ```

### 2. Toggle Saved Favourite
- **POST** `/favourites/:propertyId`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: `{ "saved": true }`

---

## Admin Endpoints (`/api/admin`)

- **GET** `/admin/stats`: KPI platform analytics
- **GET** `/admin/users`: User management list
- **PATCH** `/admin/users/:id`: Promote role or update status
- **GET** `/admin/pending-properties`: Moderation queue
