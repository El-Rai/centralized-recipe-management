const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./Recipe").sequelize;

const Template = sequelize.define("Template", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fields: {
    type: DataTypes.JSON,
    allowNull: false,
  }
});

module.exports = { Template };
