const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("./index");

class Task extends Model {}

Task.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userName: { type: DataTypes.STRING(100), allowNull: false },
    userEmail: { type: DataTypes.STRING(150), allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isEditedByAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Task",
    tableName: "tasks",
    timestamps: true,
    indexes: [
      { fields: ["userName"] },
      { fields: ["userEmail"] },
      { fields: ["isCompleted"] },
    ],
  }
);

module.exports = Task;
