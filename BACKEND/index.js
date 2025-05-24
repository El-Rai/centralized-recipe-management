// backend/index.js
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// In-memory store for recipes
let recipes = {};

// Endpoint to store a new recipe
app.post("/recipe", (req, res) => {
  const { id, name, waterPrep, mixing, bottling } = req.body;

  if (!id || !name || !waterPrep || !mixing || !bottling) {
    return res.status(400).send("Missing required fields");
  }

  // Save recipe in memory
  recipes[id] = { name, waterPrep, mixing, bottling };
  res.status(201).send("Recipe saved successfully");
});

// Endpoint to get the full recipe
app.get("/recipe/:id", (req, res) => {
  const { id } = req.params;
  const recipe = recipes[id];

  if (!recipe) {
    return res.status(404).send("Recipe not found");
  }

  res.json(recipe);
});


// Endpoint to get a specific part of the recipe
app.get("/recipe/:id/section/:machine", (req, res) => {
  const { id, machine } = req.params;
  const recipe = recipes[id];

  if (!recipe) {
    return res.status(404).send("Recipe not found");
  }

  const section = recipe[machine];

  if (!section) {
    return res.status(404).send(`${machine} section not found`);
  }

  res.json(section);
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
