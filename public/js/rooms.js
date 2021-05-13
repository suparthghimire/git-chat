import {
  setMessageItem,
  selected_reciever,
  socket,
} from "./utils/renderContent.js";
import { getConversationChatList, getUser } from "./utils/api.js";

getUser();

socket.on("messageRecieve", (message) => {
  if (
    message.reciever_id == selected_reciever.id ||
    message.sender_id == selected_reciever.id
  ) {
    setMessageItem(message);
    getConversationChatList();
  }
});
