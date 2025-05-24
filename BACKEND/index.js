// backend/index.js
const express = require("express");
const cors = require("cors");
const {Recipe, sequelize} = require("./models/Recipe");

const app = express();
const port = 5000;

// Middleware to parse JSON requests
app.use(cors());
app.use(express.json());


// In-memory store for recipes
let recipes = {};

// Endpoint to store a new recipe
app.post("/recipe", async (req, res) => {
  try {
    const { id, name, waterPrep, mixing, bottling } = req.body;
    if (!id) return res.status(400).json({ error: "ID is required" });

    await Recipe.create({ id, name, waterPrep, mixing, bottling });
    res.status(201).json({ message: "Recipe saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save recipe" });
  }
});


// Get all recipes
app.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});



// Endpoint to get the full recipe
app.get("/recipe/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

app.put("/recipe/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Not found" });

    await recipe.update(req.body);
    res.json({ message: "Recipe updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

app.delete("/recipe/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Not found" });

    await recipe.destroy();
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});



// Endpoint to get a specific part of the recipe
app.get("/recipe/:id/section/:machine", async (req, res) => {
  const { id, machine } = req.params;
  const recipe = await Recipe.findByPk(id);
  if (!recipe || !recipe[machine]) {
    return res.status(404).json({ error: `${machine} section not found` });
  }
  res.json(recipe[machine]);
});


sequelize.sync().then(() => {
  console.log("Database synced");
});


// Start the server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
