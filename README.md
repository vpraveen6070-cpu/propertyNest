# PropertyNest - Real Estate Listing & Management Platform

A modern, responsive, full-stack **Real Estate Listing Platform** built for buyers, property sellers, certified real estate agents, and platform administrators.

🌐 **Official Live Web Application**: [https://vpraveen6070-cpu.github.io/EstateNexus/](https://vpraveen6070-cpu.github.io/EstateNexus/)


---

## 🌟 Key Features

### 1. Buyer & Visitor Features
- **Hero & Advanced Search Engine**: Search properties by keyword, city, postcode, property type (Villa, Penthouse, Apartment, House, Office, Land), listing status (Sale/Rent), price range, bedrooms, bathrooms, area, furnishing, and parking.
- **Dual Display Modes**: Toggle between Grid and List view with real-time sorting (Newest, Lowest Price, Highest Price, Largest Area, Most Popular).
- **Interactive Details & Photo Lightbox**: Multi-image photo gallery, lightbox viewer, detailed specifications, amenities checklist, location map, and mortgage calculator.
- **Saved Favourites & Enquiries**: Bookmark properties to a personal favourites list and submit direct inquiries to agents/owners.

### 2. Seller & Property Owner Features
- **Property Submission Wizard**: Multi-section form supporting title, description, pricing, location coordinates, room specs, amenity multi-select, and photo image uploads.
- **Listing Status Controls**: Track active, pending, sold, rented, and inactive property statuses.
- **Enquiries Inbox**: Read and respond to direct buyer enquiries.

### 3. Real Estate Agent Features
- **Agent Profiles & Ratings**: Custom agent biography, license number, agency branding, customer review ratings, and active property portfolio.
- **Multi-Property Inventory Management**: Create and manage multiple high-value client properties.

### 4. Platform Administrator Features
- **Moderation Queue**: Review, approve, or reject pending property submissions.
- **User Role Management**: Promote users, assign roles (`buyer`, `seller`, `agent`, `admin`), or manage access permissions.
- **KPI Platform Analytics**: Real-time stats on total users, listed properties, active enquiries, and pending reviews.

---

## 🛠️ Technology Stack

- **Front-End**: React 18, React Router DOM v6, Lucide Icons, Vite, Playfair Display & DM Sans typography.
- **Back-End**: Node.js, Express.js, REST API architecture.
- **Database**: Portable JSON Database Engine (`database.json`) with async CRUD helper methods and pre-seeded real estate records.
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs password hashing with Role-Based Access Control (RBAC).

---

## 🚀 Quick Start & Installation

### 1. Installation
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Running Locally
Terminal 1 (Backend Server on http://localhost:5001):
```bash
cd server
npm start
```

Terminal 2 (Frontend App on http://localhost:3000):
```bash
cd client
npm run dev
```

---

## 🔑 Pre-Seeded Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@estate.com` | `admin123` |
| **Agent** | `sarah.agent@estate.com` | `agent123` |
| **Seller** | `john.seller@estate.com` | `seller123` |
| **Buyer** | `buyer@estate.com` | `buyer123` |

---

## 📄 License
This project is licensed under the MIT License.
