const { MessageModel, Conversation, Reaction } = require("../models/index");

const saveMessage = async (message) => {
  try {
    let messageContent = {
      message,
    };
    const messageSavedStatus = await MessageModel.create(messageContent);
    if (!messageSavedStatus) throw Error("Error While Saving Message");
    else return messageSavedStatus.dataValues.id;
  } catch (error) {
    console.error(message);
  }
};
const saveConversation = async (message, sender, reciever) => {
  try {
    const conversation = {
      sender_id: sender,
      reciever_id: reciever,
      message_id: message,
    };
    const conversationSaved = await Conversation.create(conversation);
    if (!conversationSaved) throw Error("Error while Saving Conversation");
    else return conversationSaved;
  } catch (error) {
    console.error(error);
  }
};
module.exports = {
  saveDirectConversation: async (message) => {
    let savedMessageId = await saveMessage(message.message);
    if (savedMessageId) {
      let savedConversation = saveConversation(
        savedMessageId,
        message.sender_id,
        message.reciever_id
      );
      if (savedConversation) return savedMessageId;
      else if (!savedConversation) return null;
    } else if (!savedMessageId) return null;
  },
  saveReaction: async (reactionData) => {
    try {
      const reactionSaved = await Reaction.create(reactionData);
      if (reactionSaved) return true;
    } catch (error) {
      console.error(error);
    }
  },
};
