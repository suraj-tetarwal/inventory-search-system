# Inventory Search & Management System

A full-stack inventory system that allows users to search products using multiple filters and manage supplier-based inventory using a relational database.

This project is divided into two main parts:

- **Part A:** Inventory Search System (API + UI)
- **Part B:** Inventory Database & Supplier Management APIs

The system demonstrates backend fundamentals such as filtering logic, API design, database relationships, validations, and aggregation queries.

## Live Demo & Repository

- **Frontend (UI):** [Live Demo](https://inventory-search-system.vercel.app/)
- **Backend API:** [API Base URL](https://inventory-search-system-fe1e.onrender.com/)

- **GitHub Repository:** [View Code](https://github.com/suraj-tetarwal/inventory-search-system/)

## Features

### Part A: Inventory Search System
- Search products using **partial and case-insensitive matching**
- Filter results by:
  - product name (`q`)
  - category
  - minimum price
  - maximum price
- Supports **combined filters** for precise results
- Handles edge cases:
  - empty search query
  - invalid price range
  - no matching results
- Simple frontend UI with:
  - search input
  - category dropdown
  - price range inputs
  - results display (list)
  - “No results found” state
  - "Loading" state
  - "Error" state

---

### Part B: Inventory & Supplier Management
- Create suppliers using `POST /supplier`
- Add inventory linked to suppliers using `POST /inventory`
- Fetch inventory using `GET /inventory`
- Get supplier-wise inventory summary using `GET /inventory/summary`
- Enforces data validation:
  - inventory must belong to a valid supplier
  - quantity must be ≥ 0
  - price must be > 0
- Implements **relational database design** (supplier → inventory)
- Provides grouped data:
  - inventory grouped by supplier
  - sorted by total inventory value (`quantity × price`)

 
## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- SQLite (for relational data - Part B)

### Data Source
- Static JSON file (for search - Part A)

### Tools & Others
- Postman (API testing)
- Git & GitHub (version control)
- dotenv (environment variables)

## Project Structure

```
root/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── data/
│   │   └── inventory.json        # Static data for Part A (Search)
│   │
│   ├── src/
│   │   ├── db/
│   │   │   ├── connection.js     # Database connection
│   │   │   ├── schema.sql        # Database schema
│   │   │   └── inventory.db      # SQLite database file
│   │   │
│   │   ├── controllers/          # Business logic
│   │   ├── routes/               # API routes
│   │   └── middleware/           # Error handling middleware
│   │
│   ├── server.js                 # Entry point
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
```

### Notes

- Part A uses a static JSON file for implementing search functionality.
- Part B uses SQLite database for managing suppliers and inventory with relationships.

## Database Schema

### Suppliers Table

| Column | Type | Description |
|--------|------|------------|
| id | INTEGER (PK) | Unique supplier ID |
| name | TEXT | Supplier name |
| city | TEXT | Supplier city |

---

### Inventory Table

| Column | Type | Description |
|--------|------|------------|
| id | INTEGER (PK) | Unique inventory ID |
| supplier_id | INTEGER (FK) | Reference to supplier |
| product_name | TEXT | Name of the product |
| quantity | INTEGER | Available quantity |
| price | INTEGER | Price per unit |

## API Endpoints

### Part A: Search API

#### GET `/search`

Search inventory using optional query parameters.

**Query Parameters:**
- `q` (string) → product name (partial, case-insensitive)
- `category` (string)
- `minPrice` (number)
- `maxPrice` (number)

**Example:** `/search?q=chair&category=Furniture&minPrice=500&maxPrice=2000`

**Response:**
- Returns filtered list of inventory items
- Returns empty array if no matches found


### Part B: Inventory & Supplier APIs

#### POST `/supplier`

Create a new supplier.

**Request Body:**
```json
{
  "name": "ABC Traders",
  "city": "Delhi"
}
```

**Response:**
- Returns created supplier data


---

#### POST `/inventory`

Add a new inventory item.

**Request Body:**
```json
{
  "supplier_id": 1,
  "product_name": "Office Chair",
  "quantity": 10,
  "price": 120
}
```

**Validations:**
- supplier_id must exist
- `quantity >= 0`
- `price > 0`

**Response:**
- Returns created inventory data


---

#### GET `/inventory`

Fetch all inventory records.

**Response:**
- Returns list of all inventory items including supplier info

---

#### GET `/inventory/summary`

Get supplier wise total inventory value.

**Response:**
```json
[
  {
    "supplier_id": 1,
    "supplier_name": "ABC Traders",
    "supplier_city": "Delhi",
    "total_products": 1,
    "total_quantity": 10
    "total_value": 1200
  }
]
```

## Search Logic (Part A)

The `/search` API filters inventory data based on optional query parameters.

### How filtering works

- The API starts with the full inventory dataset (from `inventory.json`)
- Filters are applied **sequentially** based on provided query parameters:
  1. Product name (`q`)
  2. Category
  3. Minimum price (`minPrice`)
  4. Maximum price (`maxPrice`)

- Each filter narrows down the result set

---

### Case-insensitive search

- Product name search is implemented using:
  - conversion to lowercase
  - partial matching using `.includes()`

- This ensures:
  - "chair" matches "Chair", "office chair", etc.

---

### Combined filters

- Multiple filters can be applied together
- Only items matching **all conditions** are returned

---

### Edge case handling

- If `q` is empty → name filter is ignored
- If `minPrice > maxPrice` → returns `400 Bad Request`
- If no items match → returns an empty array


## Validation Logic (Part B)

The following validations are implemented to ensure data integrity:

### Supplier Validation
- Before adding inventory, the system checks whether the provided `supplier_id` exists in the database
- If not found, the API returns a `404 Bad Request`

---

### Quantity Validation
- `quantity` must be greater than or equal to 0
- Prevents invalid negative stock values

---

### Price Validation
- `price` must be greater than 0
- Ensures valid product pricing

---

### Error Handling
- All validation errors return appropriate HTTP status codes and error messages
- Centralized error handling is implemented using middleware


## 📊 Inventory Summary (Grouped Query)

The API `GET /inventory/summary` provides a supplier-wise summary of total inventory value.

### What it does

- Groups inventory data by supplier
- Calculates total inventory value for each supplier using:
  
  `total_inventory_value = quantity × price`

- Sorts suppliers in **descending order** based on total inventory value

---

### How it works

- Inventory and supplier data are joined using `supplier_id`
- For each supplier:
  - The total value of all their inventory items is calculated
- The result is then sorted to show suppliers with highest inventory value first

---

### Example Response

```json
[
  {
    "supplier_id": 1,
    "supplier_name": "ABC Traders",
    "supplier_city": "Delhi",
    "total_products": 1,
    "total_quantity": 10
    "total_value": 1200
  }
]
```

## 🚀 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/suraj-tetarwal/inventory-search-system.git
cd inventory-search-system
```

### 2. Setup Backend

```bash
cd backend
npm install
```

### 3. create `.env` file in the backend folder(if require):

```bash
PORT=3000
```

### 4. State the server

```bash
npm start
```

### 5. Setup Frontend

```bash
cd ..
cd frontend
```

open `index.html` in your browser
or
Use a live server extension

## ⚡ Performance Improvements

### Part A: Search Optimization

- Currently, search is performed on a static JSON dataset in memory
- For large datasets, performance can be improved by:
  - Using a database with **indexed fields** (e.g., product name, category)
  - Implementing **pagination** to limit the number of results returned
  - Using **debouncing** on the frontend to reduce unnecessary API calls

---

### Part B: Database Optimization

- An index can be added on `supplier_id` in the inventory table:
  - This improves performance of JOIN operations and grouped queries
- For large-scale systems:
  - Use **pagination** in GET APIs to avoid returning large datasets
  - Cache results of `/inventory/summary` if data does not change frequently
 
## ⚠️ Assumptions & Edge Cases

### Assumptions

- The dataset used in Part A is small and stored in a static JSON file
- Each inventory item belongs to a single supplier
- Prices are stored as numeric values without currency formatting

---

### Edge Cases Handled

#### Search API (Part A)
- Empty search query → returns all items (or applies other filters)
- Case-insensitive product search
- Invalid price range (`minPrice > maxPrice`) → returns `400 Bad Request`
- No matching results → returns an empty array

---

#### Inventory APIs (Part B)
- Invalid `supplier_id` → prevents insertion of inventory
- Negative quantity → rejected
- Zero or negative price → rejected
