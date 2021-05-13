"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  UserModel.init(
    {
      github_id: {
        allowNull: false,
        unique: true,
        type: DataTypes.INTEGER,
      },
      github_name: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      github_avatar_url: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      github_repository: {
        type: DataTypes.INTEGER,
      },
      github_followers: {
        type: DataTypes.INTEGER,
      },
      github_following: {
        type: DataTypes.INTEGER,
      },
      onlineStatus: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "UserModel",
    }
  );
  return UserModel;
};
