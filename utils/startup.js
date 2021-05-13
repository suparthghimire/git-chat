const fetch = require("node-fetch");
const UserModel = require("../models/index").UserModel;
const MessageModel = require("../models/index").MessageModel;
const Conversation = require("../models/index").Conversation;

module.exports = {
  saveUsers: async () => {
    try {
      const response = await fetch("https://api.github.com/users");
      const data = await response.json();

      data.forEach(async (item) => {
        try {
          const object = {
            github_id: item.id,
            github_name: item.login,
            github_avatar_url: item.avatar_url,
            github_repository: item.public_repos,
            github_followers: item.followers,
            github_following: item.following,
            onlineStatus: true,
          };
          let creationStatus = await UserModel.create(object);
          if (creationStatus) console.log("Users Created!");
        } catch (error) {
          console.error(error);
        }
      });
    } catch (error) {
      console.error(err);
    }
  },
  saveMessage: async () => {
    try {
      for (let i = 1; i <= 31; i++) {
        const message = {
          message: `User_${i}`,
        };
        const messageSavedStatus = await MessageModel.create(message);
        if (messageSavedStatus) {
          console.log("Message Saved!");
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
  saveConversation: async () => {
    try {
      for (let k = 1; k <= 3; k++) {
        for (let i = 1; i <= 31; i++) {
          for (let j = 1; j <= 31; j++) {
            if (i != j) {
              const conversation = {
                sender_id: i,
                reciever_id: j,
                message_id: i,
              };
              const conversationSaved = await Conversation.create(conversation);
              if (conversationSaved) {
                console.log("conversation saved");
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};
