require('dotenv').config();  // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors({
    origin: 'https://ptreddy-95.github.io'
}));

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Get MongoDB URI from environment variables
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose.connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect:", err));

// Define Product schema
const productSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true, 
    enum: ['Electronics', 'Books', 'Fashion', "Men's clothing", "Women's clothing", "Jewelery"]
  },
  name: String,
  price: Number,
  model: String,
  imageUrl: String,
  description: String,
});

const Product = mongoose.model('Product', productSchema);

// Seed database function (run only once to avoid duplicates)
async function seedDatabase() {
  try {
    const existingProducts = await Product.find();
    if (existingProducts.length === 0) {
      const products = [
        { name: 'Product 1', price: 10, imageUrl: 'images/product1.jpg' },
        { name: 'Product 2', price: 20, imageUrl: 'images/product2.jpg' },
        { name: 'Product 3', price: 30, imageUrl: 'images/product3.jpg' },
      ];
      await Product.insertMany(products);
      console.log('Database seeded!');
    } else {
      console.log('Database already contains products');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Call the seed function (comment out or remove after first run)
seedDatabase();

// API route to get products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.status(404).json({ error: 'No products found' });
    }
    res.json(products);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
