const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("./Recipe"); // reuse same connection

const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false }, // 'admin' or 'operator'
});

module.exports = { User };
