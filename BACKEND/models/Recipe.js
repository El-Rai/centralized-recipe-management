const { Sequelize, DataTypes } = require("sequelize");

// Reuse the same DB connection
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "recipes.db"
});

const Recipe = sequelize.define("Recipe", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  templateId: {
    type: DataTypes.INTEGER,
  },
  data: {
    type: DataTypes.JSON,
  }
});

module.exports = { Recipe, sequelize };
