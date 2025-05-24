// backend/index.js
const express = require("express");


const app = express();
const port = 5000;

// Middleware to parse JSON requests
app.use(express.json());

// In-memory store for recipes
let recipes = {};

// Endpoint to store a new recipe
app.post("/recipe", (req, res) => {
  const recipe = req.body;

  if (!recipe.id) {
    return res.status(400).json({ error: "Recipe ID is required" });
  }

  recipes[recipe.id] = recipe;

  console.log(`Saved recipe: ${recipe.id}`);
  res.status(201).json({ message: "Recipe saved successfully" });
});


// Endpoint to get the full recipe
app.get("/recipe/:id", (req, res) => {
  const id = req.params.id;
  const recipe = recipes[id];

  if (!recipe) {
    return res.status(404).json({ error: "Recipe not found" });
  }

  res.json(recipe);
});



// Endpoint to get a specific part of the recipe
app.get("/recipe/:id/section/:machine", (req, res) => {
  const { id, machine } = req.params;
  const recipe = recipes[id];

  if (!recipe) {
    return res.status(404).json({ error: "Recipe not found" });
  }

  const section = recipe[machine];
  if (!section) {
    return res.status(404).json({ error: `${machine} section not found` });
  }

  res.json(section);
});


// Start the server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
