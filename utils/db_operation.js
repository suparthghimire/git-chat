const MessageModel = require("../models/index").MessageModel;
const Conversation = require("../models/index").Conversation;

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
  } catch (error) {}
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
      if (savedConversation) return true;
      else if (!savedConversation) return false;
    } else if (!savedMessageId) return false;
  },
};
