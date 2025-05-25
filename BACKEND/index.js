// backend/index.js
const express = require("express");
const cors = require("cors");
const {Recipe, sequelize} = require("./models/Recipe");
const { Template } = require("./models/Template");
const machineNodeMap = require("./machineConfig");
const {sendToMachine} = require("./opcua");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("./models/User");



const app = express();
const port = 5000;

// Middleware to parse JSON requests
app.use(cors());
app.use(express.json());

// Middleware for authentication
// JWT auth middleware
const requireAuth = (roles = []) => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const payload = jwt.verify(token, "secret123"); // use env var in prod
    if (roles.length && !roles.includes(payload.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};


app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, "secret123", {
    expiresIn: "1d",
  });

  res.json({ token, role: user.role });
});

app.get("/seed-users", async (req, res) => {
  await User.destroy({ where: {} });
  await User.bulkCreate([
    {
      username: "admin",
      password: bcrypt.hashSync("admin123", 10),
      role: "admin",
    },
    {
      username: "operator",
      password: bcrypt.hashSync("operator123", 10),
      role: "operator",
    },
  ]);
  res.send("Users seeded");
});


// In-memory store for recipes
let recipes = {};

// Endpoint to store a new recipe
app.post("/recipe", requireAuth(["admin"]), async (req, res) => {
  try {
    const { id, name, templateId, data } = req.body;
    if (!id || !templateId || !data) {
      return res.status(400).json({ error: "Missing fields" });
    }

    await Recipe.create({ id, name, templateId, data });
    res.status(201).json({ message: "Recipe saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save recipe" });
  }
});



// Get all recipes
app.get("/recipes", requireAuth(["admin"]), async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});



// Endpoint to get the full recipe
app.get("/recipe/:id",requireAuth(["admin","operator"]), async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

app.put("/recipe/:id", requireAuth(["admin"]), async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Not found" });

    await recipe.update({
      name: req.body.name,
      data: req.body.data,
    });

    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});


app.delete("/recipe/:id", requireAuth(["admin"]), async (req, res) => {
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
app.get("/recipe/:id/section/:machine", requireAuth(["admin", "operator"]), async (req, res) => {
  const { id, machine } = req.params;
  const recipe = await Recipe.findByPk(id);
  if (!recipe || !recipe[machine]) {
    return res.status(404).json({ error: `${machine} section not found` });
  }
  res.json(recipe[machine]);
});

// For Template Designer
// Create a new template
app.post("/templates", requireAuth(["admin"]), async (req, res) => {
  try {
    const { name, fields } = req.body;
    if (!name || !fields) {
      return res.status(400).json({ error: "Name and fields are required" });
    }

    const template = await Template.create({ name, fields });
    res.status(201).json(template);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save template" });
  }
});

// Get all templates
app.get("/templates", requireAuth(["admin"]), async (req, res) => {
  try {
    const templates = await Template.findAll();
    res.json(templates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load templates" });
  }
});

// Get one template by ID
app.get("/templates/:id", requireAuth(["admin"]), async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id);
    if (!template) return res.status(404).json({ error: "Not found" });
    res.json(template);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch template" });
  }
});

//dispatching routes
app.post("/dispatch/:id", requireAuth(["admin"]), async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    const data = recipe.data;
    console.log("Recipe data keys:", Object.keys(recipe.data));

    for (const machineName of Object.keys(data)) {
      const values = data[machineName];
      const config = machineNodeMap[machineName];
      if (!config) {
        console.warn(`⚠️ No config for machine: ${machineName}`);
        continue;
      }

      await sendToMachine(machineName, values, config);
    }

    res.json({ message: "Recipe dispatched to machines." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Dispatch failed" });
  }
});




sequelize.sync().then(() => {
  console.log("Database synced (recipes + templates)");
});


// Start the server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
