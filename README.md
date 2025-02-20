# Full Stack Developer Assessment

This project is part of my assessment for the Full Stack Developer role at Elite Tech Park. It involves developing APIs for an E-commerce website, handling different user roles (admin, staff, vendor, and user) with specific permissions and functionalities.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Postman Collection](#postman-collection)

## Project Overview

The task was to implement a system for managing an E-commerce website with various user roles and product details. The system provides role-based access control and CRUD operations for product management, including features like product creation, viewing, and updating.

### Key Features:

1. **Role-Based Authentication:**
   - Admin, Vendor, and Customer roles with specific permissions.
   - Admins can create, update, and view products.
   - Vendors can add and view their products.
   - Customer can view all products, including vendor details and discount information.

2. **CRUD Operations:**
   - Sign-up and login for buyers and vendors.
   - Admins can create staff and manage products.
   - All Customers can view products with additional information such as vendor details and discount calculations.

3. **Database:**
   - MySQL database used for storing user, vendor, product, and other related data.
   - Ensured that product URLs are unique and that expiration dates are correctly handled.

4. **Search & Pagination:**
   - Implemented search functionality and pagination for product listing.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Token)
- **Role Management**: Role-based access control for different users
- **API Testing**: Postman
- **Other**: bcrypt (for password hashing)

## Setup and Installation

### Prerequisites:
- Node.js (v14 or later)
- MySQL (for database setup)

### Steps to Run the Project:

1. Clone the repository:
   ```bash
   git clone https://github.com/VarnikaMoorthy/ECommerce.git
