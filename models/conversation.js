"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ UserModel, MessageModel }) {
      // define association here
      this.belongsTo(UserModel, {
        foreignKey: "sender_id",
        // through: UserModel,
      });
      this.belongsTo(UserModel, {
        foreignKey: "reciever_id",
        // through: UserModel,
      });
      this.belongsTo(MessageModel, {
        foreignKey: "message_id",
      });
    }
  }
  Conversation.init(
    {
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reciever_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      message_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Conversation",
    }
  );
  return Conversation;
};
