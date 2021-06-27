"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ MessageModel, UserModel }) {
      // define association here
      this.belongsTo(MessageModel);
      this.belongsTo(UserModel);
    }
  }
  Reaction.init(
    {
      reaction: {
        type: DataTypes.INTEGER(),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Reaction",
    }
  );
  return Reaction;
};
