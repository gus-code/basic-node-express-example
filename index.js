// Import express framework
const express = require("express");
// Initialize express framework
const app = express();
// Declare the port where our API will be running
const PORT = 3000;

// Add express json middleware to convert request body to json
app.use(express.json());

// Initialize products array to save data in memory
const products = [];

// Get all products endpoint
app.get("/products", (req, res) => {
  // Return all the products with a 200 status code
  res.status(200).send({
    products,
  });
});

// Get product by id endpoint
app.get("/products/:id", (req, res) => {
  // Retrieve the id from the route params
  const { id } = req.params;
  // Check if we have a product with that id
  const product = products.find((p) => p.id === id);

  if (!product) {
    // If we don't find the product return a 404 status code with a message
    res.status(404).send({ message: "The product could not be found" });
    // Remember that send method doesn't interrupt the workflow
    // therefore is important to add a "return" to break the process
    return;
  }

  // Return the product with a 200 status code
  res.status(200).send({
    product,
  });
});

// Create a product endpoint
app.post("/products", (req, res) => {
  // Retrieve the name from the request body
  const { name } = req.body;

  if (!name) {
    // If name is empty or undefined return a 400 status code with a message
    res.status(400).send({ message: "The name is required." });
    return;
  }

  // Generate a new product
  const newProduct = {
    id: Date.now().toString(), // Convert id to string to match the value in get by id endpoint
    name,
  };
  // Add the new product to our array
  products.push(newProduct);

  // Return the created product with a 201 status code
  res.status(201).send({
    product: newProduct,
  });
});

// Update product endpoint
app.patch("/products/:id", (req, res) => {
  // Retrieve the id from the route params
  const { id } = req.params;
  // Retrieve the index of the product in the array
  const productIndex = products.findIndex((p) => p.id === id);

  // "findIndex" will return -1 if there is no match 
  if (productIndex === -1) {
    // If we don't find the product return a 404 status code with a message
    res.status(404).send({ message: "The product you want to update could not be found" });
    return;
  }

  // Generate a copy of our product
  const updateProduct = { ...products[productIndex] };
  // Retrieve the name from the request body
  const { name } = req.body;

  // Check if we have a name, if so update the property
  if (name) {
    updateProduct.name = name;
  }

  // Update the product in our array
  products[productIndex] = updateProduct;

  // Return the updated product with a 200 status code
  res.status(200).send({
    product: updateProduct,
    status: "success",
  });
});

// Delete product endpoint
app.delete("/products/:id", (req, res) => {
  // Retrieve the id from the route params
  const { id } = req.params;
  // Retrieve the index of the product in the array
  const productIndex = products.findIndex((p) => p.id === id);

  // "findIndex" will return -1 if there is no match 
  if (productIndex === -1) {
    // If we don't find the product return a 404 status code with a message
    res.status(404).send({ message: "The product you want to delete could not be found" });
    return;
  }

  // Remove the product from the array
  products.splice(productIndex, 1);

  // Return a 204 status code
  res.status(204).send();
});

// "listen" method starts our API, the first argument is the port where the API will be running
// the second argument is optional and can be use to do something when the API starts
app.listen(PORT, () => console.log(`API is running in http://localhost:${PORT}`));
