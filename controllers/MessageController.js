const MessageModel = require("../models/index").MessageModel;
module.exports = {
  saveMessage: async (req, res) => {
    try {
      const { sender_id, reciever_id, message } = req.body;
      try {
        const saveStatus = await MessageModel.create({
          sender_id,
          reciever_id,
          message,
        });
        if (!saveStatus) throw Error("Error: Message Not Saved!");
        else {
          console.log("Message Saved to Database!");
          return res.status(200).json({ message: "Message Saved to Database" });
        }
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(error);
    }
  },
};
