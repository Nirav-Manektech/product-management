Here’s a clean and professional API documentation you can include in a `README.md` or submit separately as part of your **Back-End Developer Test**:

---

# 🛒 E-commerce Product Management - Product API

This project provides a backend API for managing products in an e-commerce system. It supports full CRUD operations along with filtering capabilities based on price, name, and keyword search.

---

## 🛠 Tech Stack

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB 
* **Tooling**: Postman

---

## 🚀 How to Run the Project

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start
```

The server will start on `http://localhost:9001` (default port unless specified in `.env`).

---

## 📦 API Endpoints

### 🔹 Create a Product

* **Method**: `POST`
* **URL**: `/api/products`
* **Body** (JSON):

```json
{
    "title":"AirPods Pro Max Wireless Headphones6",
    "manufacturer":"Apple",
    "stock":[{
        "color":"Space Grey",
        "stock": 10,
        "price":1,
        "image":"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
    },{
        "color":"Silver",
        "stock": 80,
        "price":2,
        "image":"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
    }],
    "isShippingFree":true,
    "discountPercentage":18,
    "warrantyYear":2,
    "rating":4.2,
    "category":"Wooden",
    "isPremiumQuality":true,
    "keyFeatures":["Active Noise Cancellation", "Spatial Audio", "20h Battery", "Premium Materials"]
}
```

* **Curl Example**:

```bash
curl -X POST http://localhost:9001/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Smartphone","description":"Latest model","price":599.99,"category":"Electronics"}'
```

---

### 🔹 Get All Products

* **Method**: `GET`

* **URL**: `/api/products`

* **Query Parameters (optional)**:

  * `search`: Filter by product name (partial match)
  * `category`: Electronics (Name of category)
  * `sortBy`: stock.price:asc (pricing and name sorting)

* **Example**: `/api/products?name=phone&minPrice=100&maxPrice=1000&search=smart`

* **Curl Example**:

```bash
curl "http://localhost:9001/api/products?search=Headphones&sortBy=stock.price:asc&category=Electronics"
```

---

### 🔹 Get a Product by ID

* **Method**: `GET`

* **URL**: `/api/products/:id`

* **Curl Example**:

```bash
curl http://localhost:9001/api/products/64a1cfb8a1e2a5ef4e8c1234
```

---

### 🔹 Update a Product

* **Method**: `PUT`
* **URL**: `/api/products/:id`
* **Body** (JSON):

```json
{
    "title": "AirPods Pro Max Wireless Headphones7",
    "manufacturer": "Apple",
    "stock": [
        {
            "color": "Space Grey",
            "stock": 10,
            "price": 1,
            "image": [
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
            ],
        },
        {
            "color": "Silver",
            "stock": 80,
            "price": 2,
            "image": [
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
            ],
        }
    ],
    "isShippingFree": true,
    "discountPercentage": 18,
    "warrantyYear": 2,
    "rating": 4.2,
    "category": "Wooden",
    "isPremiumQuality": true,
    "keyFeatures": [
        "Active Noise Cancellation",
        "Spatial Audio",
        "20h Battery",
        "Premium Materials"
    ],
}
```

* **Curl Example**:

```bash
curl -X PUT http://localhost:3000/api/products/64a1cfb8a1e2a5ef4e8c1234 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AirPods Pro Max Wireless Headphones7",
    "manufacturer": "Apple",
    "stock": [
        {
            "color": "Space Grey",
            "stock": 10,
            "price": 1,
            "image": [
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
            ],
        },
        {
            "color": "Silver",
            "stock": 80,
            "price": 2,
            "image": [
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
            ],
        }
    ],
    "isShippingFree": true,
    "discountPercentage": 18,
    "warrantyYear": 2,
    "rating": 4.2,
    "category": "Wooden",
    "isPremiumQuality": true,
    "keyFeatures": [
        "Active Noise Cancellation",
        "Spatial Audio",
        "20h Battery",
        "Premium Materials"
    ],
}'
```

---

### 🔹 Delete a Product

* **Method**: `DELETE`

* **URL**: `/api/products/:id`

* **Curl Example**:

```bash
curl -X DELETE http://localhost:3000/api/products/64a1cfb8a1e2a5ef4e8c1234
```
