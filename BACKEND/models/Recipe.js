const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "recipes.db" // Will create this file in the root
});

const Recipe = sequelize.define("Recipe", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING
  },
  waterPrep: {
    type: DataTypes.JSON
  },
  mixing: {
    type: DataTypes.JSON
  },
  bottling: {
    type: DataTypes.JSON
  }
});

module.exports = { Recipe, sequelize };
