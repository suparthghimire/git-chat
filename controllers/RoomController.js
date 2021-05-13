const jwt = require("jsonwebtoken");
const { sequelize } = require("../models/index");
const UserModel = require("../models/index").UserModel;
const Conversation = require("../models/index").Conversation;

const getAuthUserId = (req) => {
  let jwtToken = req.cookies.jwt_gitchat;
  if (jwtToken) {
    return jwt.verify(
      jwtToken,
      process.env.JWT_SECRET,
      (error, decodedToken) => {
        if (error) {
          return {
            message: "Error",
            data: error,
          };
        } else {
          return {
            message: "Success",
            data: decodedToken.payload.id,
          };
        }
      }
    );
  } else
    return {
      message: "Error",
      data: null,
    };
};

module.exports = {
  getUserData: (req, res) => {
    let jwtToken = req.cookies.jwt_gitchat;
    if (jwtToken) {
      jwt.verify(
        jwtToken,
        process.env.JWT_SECRET,
        async (error, decodedToken) => {
          if (error) {
            res.redirect("/");
          } else {
            let user = await UserModel.findOne({
              where: { id: decodedToken.payload.id },
            });
            res.status(200).json({ user });
          }
        }
      );
    }
  },
  getAllConversations: (req, res) => {
    let jwtToken = req.cookies.jwt_gitchat;
    if (jwtToken) {
      jwt.verify(
        jwtToken,
        process.env.JWT_SECRET,
        async (error, decodedToken) => {
          if (error) {
            res.redirect("/");
          } else {
            let conversations = await sequelize.query(`
                  select  sender_id, reciever_id, message_id, UserModels.github_name as reciever_name,
                  MessageModels.message, UserModels.github_avatar_url as avatar_url, Conversations.createdAt from Conversations
                  INNER join MessageModels on MessageModels.id = Conversations.message_id
                  INNER join UserModels on UserModels.id = Conversations.reciever_id
                  where sender_id = ${decodedToken.payload.id}
                  group by reciever_id ORDER by Conversations.createdAt ASC 
              `);
            conversations = conversations[0];
            res.status(200).json(conversations);
          }
        }
      );
    }
  },
  getAllMessages: async (req, res) => {
    let user_token = getAuthUserId(req);
    if (
      user_token.message == "Error" ||
      !user_token.data ||
      user_token.data == null
    ) {
      return res.status(400).json(user_token);
    } else {
      try {
        const sender_id = user_token.data;
        const reciever_id = parseInt(req.body.id);
        let allConversation = await sequelize.query(
          `
          select sender_id, message_id, reciever_id,
          UserModels.github_name as reciever_name,
          UserModels.github_avatar_url as reciever_avatar,
          MessageModels.message, Conversations.createdAt from Conversations 
          inner join UserModels on UserModels.id = Conversations.reciever_id
          inner join MessageModels on MessageModels.id = Conversations.message_id
          where sender_id = ${sender_id} and reciever_id = ${reciever_id}
          or sender_id = ${reciever_id} and reciever_id = ${sender_id}
          order by Conversations.createdAt ASC
        `
        );
        allConversation = allConversation[0];
        return res.status(200).json(allConversation);
      } catch (error) {
        console.error(error);
      }
    }
  },
};
