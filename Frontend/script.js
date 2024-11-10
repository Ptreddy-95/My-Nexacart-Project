document.addEventListener("DOMContentLoaded", () => {
  // Call functions on DOM load
  loadProducts();
  updateCartCount();

  // Display cart items only on cart.html
  if (window.location.pathname.includes("cart.html")) {
    displayCartItems();
  }
});

// Store all products globally
let allProducts = [];

// Load products from the backend API
async function loadProducts() {
  try {
    const response = await fetch('https://my-nexacart-project.onrender.com/api/products'); // Ensure backend is running on this URL
    allProducts = await response.json(); // Parse JSON data and store
    displayProducts(allProducts); // Display all products initially
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

// Display products in the product list
function displayProducts(products) {
  const productList = document.getElementById("product-list");
  if (!productList) return; // Check if element exists
  
  productList.innerHTML = ''; // Clear previous content

  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    productDiv.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Price: $${product.price}</p>
      <button onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.imageUrl}')">Add to Cart</button>
    `;
    
    productList.appendChild(productDiv);
  });
}

// Filter products by category
function filterCategory(category) {
  const filteredProducts = allProducts.filter(product => product.category === category);
  displayProducts(filteredProducts);
}

// Add item to cart
function addToCart(productId, productName, productPrice, productImage) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  console.log("Initial Cart:", cart);

  // Add the new item to the cart without checking for existing items
  cart.push({ id: productId, name: productName, price: productPrice, image: productImage });

  localStorage.setItem('cart', JSON.stringify(cart));
  console.log("Updated Cart:", cart);
  updateCartCount();
  alert(`${productName} added to cart!`);
}


// Display cart items
function displayCartItems() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  console.log("Displaying Cart Items:", cart);
  
  const cartItemsDiv = document.getElementById('cartItems');
  cartItemsDiv.innerHTML = ''; // Clear existing items
  
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  // Display each cart item
  cart.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cart-item');
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" style="width: 100px;">
      <p><strong>${item.name}</strong></p>
      <p>Price: $${item.price}</p>
      <p>Quantity: ${item.quantity}</p>
      <button onclick="removeFromCart('${item.id}')">Remove</button>
    `;
    cartItemsDiv.appendChild(itemDiv);
  });
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id !== productId);

  // Save updated cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Refresh the cart display and update the cart count
  displayCartItems();
  updateCartCount();
}
window.onload = function() {
  displayCartItems(); // Call displayCartItems() on page load to show the current cart
  updateCartCount(); // Update the cart count in the header
};


// Update cart count in the header
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.innerText = cartCount;
  }
}

// Checkout - redirect to checkout page
function checkout() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cartItems.length === 0) {
    alert("Your cart is empty! Please add some products before proceeding to checkout.");
  } else {
    window.location.href = 'checkout.html'; // Redirect to checkout page
  }
}

// Search products
function searchProduct() {
  const searchQuery = document.getElementById("search-bar").value.toLowerCase();
  const filteredProducts = allProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery)
  );
  displayProducts(filteredProducts);
}

// Login function
function login(event) {
  event.preventDefault();
  alert("Logged in successfully!");
  localStorage.setItem('isLoggedIn', true); // Mark as logged in
  window.location.href = "index.html";
}

// Signup function
function signup(event) {
  event.preventDefault();
  alert("Signed up successfully!");
  window.location.href = "login.html";
}

// Handle account page
function checkAccountStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  
  if (!isLoggedIn) {
    window.location.href = "login.html"; // Redirect to login if not logged in
  }
}

// Redirect to sign-up page from login page
function redirectToSignup() {
  window.location.href = "signup.html";
}
