# Ecommerce online store

A modern, full-stack e-commerce website for selling electronics built with React, Node.js, Express, and MongoDB.

## Features

✨ **Frontend**
- Beautiful product catalog with responsive grid layout
- Search and filter products by category
- Sort products by name and price
- Shopping cart with add/remove/quantity management
- Modern UI with smooth animations and gradients
- Mobile-friendly responsive design

🔧 **Backend**
- RESTful API for product management
- MongoDB database for product storage
- CORS enabled for cross-origin requests
- Full CRUD operations for products
- Environment configuration with dotenv

## Project Structure

```
electronics-shop/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductList.jsx
│   │   │   └── Cart.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── package.json
│
└── server/                    # Node.js Backend
    ├── src/
    │   ├── config/
    │   │   └── db.js
    │   ├── models/
    │   │   └── Product.js
    │   ├── routes/
    │   │   └── productRoutes.js
    │   ├── controllers/
    │   ├── middleware/
    │   ├── index.js
    │   └── App.jsx
    ├── .env.example
    └── package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string:
```
MONGO_URI=mongodb://localhost:27017/electronics-shop
PORT=5000
```

5. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:5173`

## API Endpoints

### Products

**GET** `/api/products`
- Get all products
- Response: Array of product objects

**GET** `/api/products/:id`
- Get a single product by ID
- Response: Product object

**POST** `/api/products`
- Create a new product
- Body: Product data (name, price, category, etc.)
- Response: Created product object

**PUT** `/api/products/:id`
- Update a product
- Body: Fields to update
- Response: Updated product object

**DELETE** `/api/products/:id`
- Delete a product
- Response: Success message

## Product Model

```javascript
{
  name: String (required),
  sku: String (required, unique),
  category: String (required),
  brand: String,
  price: Number (required, min: 0),
  description: String,
  specs: String,
  imageUrl: String,
  inStock: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Adding Sample Products

Use the API to add sample products:

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "sku": "IP15PRO",
    "category": "Phones",
    "brand": "Apple",
    "price": 120000,
    "description": "Latest Apple smartphone with A17 Bionic chip",
    "specs": "6.1 inch display, 256GB storage",
    "imageUrl": "https://example.com/iphone.jpg",
    "inStock": true
  }'
```

## Technologies Used

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling with gradients and animations
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management
- **Nodemon** - Auto-reload during development

## Styling Features

- Modern gradient header with purple theme
- Card-based product layout
- Smooth hover animations
- Responsive grid that adapts to screen size
- Mobile-optimized controls
- Professional color scheme and typography
- Accessible button states and focus indicators

## Development

### Frontend Development
```bash
cd client
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

### Backend Development
```bash
cd server
npm run dev        # Start with nodemon
npm start          # Start normally
```

## Future Enhancements

- [ ] User authentication and registration
- [ ] Shopping cart persistence (localStorage/database)
- [ ] Order management system
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Product reviews and ratings
- [ ] Admin dashboard
- [ ] Product image upload
- [ ] Advanced filtering and search
- [ ] Wishlist functionality
- [ ] Email notifications

## License

ISC

## Author

Kangogo Evans

## Support

For issues and questions, please create an issue in the repository.
