# EstateNexus Testing Guide & Verification Report

Comprehensive guide for performing unit tests, integration tests, form validation checks, role permission verifications, and responsive UI testing.

## 1. Automated Integration Tests

An automated API integration test suite is located in `/server/test.js`.

### How to Run Automated Tests:
```bash
cd server
npm test
```

### Test Coverage:
1. **Health Check Endpoint**: Asserts HTTP 200 OK on `/api/health`.
2. **Authentication Flow**: Asserts JWT generation for valid admin credentials.
3. **Multi-Parameter Property Search**: Validates database queries with location and property type filtering.
4. **Enquiry Submission**: Asserts buyer message dispatch and database record insertion.
5. **Admin KPI Analytics**: Verifies role-based access control and stats computation.

---

## 2. Pre-Seeded Test Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@estate.com` | `admin123` | Full moderation queue, user role management, platform analytics, instant publishing. |
| **Agent** | `sarah.agent@estate.com` | `agent123` | Property listing creation, agent profile editor, received enquiries inbox, portfolio stats. |
| **Seller** | `john.seller@estate.com` | `seller123` | Property submission for review, listing status toggle (Sold/Rented), buyer messages. |
| **Buyer** | `buyer@estate.com` | `buyer123` | Property browsing, advanced search filters, saved favourites, direct agent enquiries. |

---

## 3. Manual Testing Checklist

- [x] **Home Page**: Verify hero search form, featured listings carousel, property category tiles, and newsletter subscription form.
- [x] **Advanced Search & Filtering**: Verify multi-field filters (Keyword, City, Postcode, Price Range, Beds/Baths, Furnishing, Parking) and Grid/List view toggles.
- [x] **Property Details & Lightbox**: Verify full image gallery, lightbox expansion on photo click, amenities grid, location map, and agent enquiry modal.
- [x] **Property Submission Form**: Test required field validation, URL image adder, amenities checkboxes, and submission workflow.
- [x] **Dashboard Management**: Test tab switching (Listings, Enquiries, Favourites, Profile, Admin Moderation).
- [x] **Responsive Layout**: Tested across Mobile (375px), Tablet (768px), and Desktop (1280px+) viewport widths.
