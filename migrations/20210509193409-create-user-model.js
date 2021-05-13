"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UserModels", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      github_id: {
        allowNull: false,
        unique: true,
        type: Sequelize.INTEGER,
      },
      github_name: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      github_avatar_url: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      github_repository: {
        type: Sequelize.INTEGER,
      },
      github_followers: {
        type: Sequelize.INTEGER,
      },
      github_following: {
        type: Sequelize.INTEGER,
      },
      onlineStatus: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("UserModels");
  },
};
