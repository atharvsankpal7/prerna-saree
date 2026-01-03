# Prerna Saree - Feature Implementation Plan

This document outlines the requirements and step-by-step implementation guide for the Prerna Saree web application, based on the provided analysis of `components/.txt` and `components/how to implement.text`.

## 1. Project Overview & Tech Stack

**Goal**: Build a dynamic, content-managed e-commerce catalog for sarees with an admin panel for content management and a customer-facing PWA for browsing and ordering via WhatsApp.

**Tech Stack**:
*   **Framework**: Next.js (App Router recommended)
*   **Authentication**: NextAuth.js (Credentials Provider)
*   **Database**: MongoDB (via Mongoose)
*   **Styling**: Tailwind CSS (as per existing project structure)
*   **Deployment**: Vercel (implied standard)

---

## 2. Detailed Requirements

### A. Admin Panel (Secure Area)
*   **Authentication**: Secure login using Email and Password.
*   **Hero Section Management**: Upload/Manage 5 images for the home page carousel.
*   **Category Management**:
    *   Create categories (e.g., Silk, Cotton).
    *   Upload category banner/cover image.
    *   Delete categories.
*   **Product Management**:
    *   Select Category (Dropdown).
    *   **Media**: Upload Primary Photo and Image Gallery (multiple angles).
    *   **Details**: Name, Description.
    *   **Specifications**: Structured fields for Color, Fabric, Design, Border, Blouse.
*   **Video Content Management**:
    *   **Influencer Feedback**: Upload Instagram Reel/YouTube links + Creator Name & Review Summary.
    *   **Dispatch Magic**: Upload YouTube links. *Requirement*: Automatically fetch/display thumbnails from the YouTube link.
*   **Review Moderation**:
    *   View incoming customer reviews.
    *   Toggle status: Approve/Reject.

### B. Client-Facing Application (PWA)
*   **Hero Section**: Dynamic carousel fetching the 5 admin-uploaded images.
*   **New Arrivals**: Automatically display the 10 latest products from the database.
*   **Exclusive Collections**:
    *   Display Categories with cover images.
    *   Clicking a category redirects to a product listing page filtered by that category.
*   **Dispatch Magic & Influencer Sections**: Display videos managed by admin.
*   **Product Page (`/product/[id]`)**:
    *   Display full product details, specs, and image gallery.
    *   **Call to Action**: "Order Now" button redirecting to WhatsApp with the specific product link/message.
*   **Customer Reviews**:
    *   Display approved reviews.
    *   **Submission Form**: Allow customers to submit reviews with:
        *   Rating (1-5 stars)
        *   Photo upload
        *   Video Link (Reel/YT)
        *   Name & Description
*   **PWA**: Ensure the app is installable and responsive.

---

## 3. Implementation Guide

### Step 1: Project Setup & Database Configuration
1.  **Install Dependencies**:
    ```bash
    npm install mongoose next-auth bcryptjs axios react-hook-form
    # If using cloud storage for images (recommended)
    npm install cloudinary
    ```
2.  **Environment Variables**: Configure `.env` with `MONGODB_URI`, `NEXTAUTH_SECRET`, and Cloudinary credentials.
3.  **Database Connection**: Create `lib/mongodb.ts` to handle cached MongoDB connections.

### Step 2: Define Mongoose Models
Create schemas in `models/`:
*   **User**: `email`, `password` (hashed).
*   **Category**: `name`, `image`, `slug`.
*   **Product**:
    ```javascript
    {
      name: String,
      description: String,
      category: { type: ObjectId, ref: 'Category' },
      images: [String], // URLs
      specs: {
        color: String,
        fabric: String,
        design: String,
        border: String,
        blouse: String
      },
      createdAt: Date
    }
    ```
*   **SiteContent**: Singleton or keyed collection for `heroImages`, `influencerVideos`, `dispatchVideos`.
*   **Review**: `productId`, `rating`, `userImage`, `videoLink`, `comment`, `isApproved` (Boolean).

### Step 3: Admin Authentication
1.  **Setup NextAuth**: Configure `app/api/auth/[...nextauth]/route.ts` with CredentialsProvider.
2.  **Protect Routes**: Create middleware to restrict access to `/admin/*` routes.

### Step 4: API Route Development
Create standard CRUD endpoints in `app/api/`:
*   `/api/categories`: GET, POST, DELETE.
*   `/api/products`: GET (with query params for filtering), POST, DELETE.
*   `/api/content/hero`: GET, PUT (update images).
*   `/api/content/videos`: GET, POST, DELETE (for both types).
*   `/api/reviews`: GET (admin: all, public: approved only), POST, PATCH (approve/reject).

### Step 5: Admin Dashboard Implementation
*   **Layout**: Create a sidebar layout for Admin.
*   **Hero Manager**: Simple image uploader (Cloudinary widget recommended) that updates the `SiteContent` collection.
*   **Category Manager**: Form to upload image and set name. List view with delete button.
*   **Product Manager**:
    *   Fetch categories for the dropdown.
    *   Multi-image uploader.
    *   Form fields for specs.
*   **Video Manager**:
    *   Input fields for URLs.
    *   *Helper Function*: Extract YouTube ID from URL to generate thumbnail URL (`https://img.youtube.com/vi/[ID]/hqdefault.jpg`).

### Step 6: Client-Side Feature Implementation
*   **Home Page**:
    *   `Hero`: Fetch `heroImages` from API.
    *   `NewArrivals`: Fetch products sorted by `createdAt: -1` limit 10.
    *   `Collections`: Fetch all categories.
*   **Product Listing**: Dynamic page `/collections/[category]` fetching products where `category` matches.
*   **Product Details (`/product/[id]`)**:
    *   Fetch product by ID.
    *   **WhatsApp Button**:
        ```javascript
        const message = `Hi, I'm interested in ${product.name}: ${window.location.href}`;
        const waLink = `https://wa.me/YOUR_NUMBER?text=${encodeURIComponent(message)}`;
        ```
*   **Reviews Component**:
    *   List approved reviews.
    *   Form for submission (handle image upload to cloud before sending URL to API).

