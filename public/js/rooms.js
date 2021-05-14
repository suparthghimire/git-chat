import {
  setMessageItem,
  selected_reciever,
  socket,
  getAuthUser,
  manageConversationList,
} from "./utils/renderContent.js";
import { getUser } from "./utils/api.js";

getUser();

socket.on("messageRecieve", (message) => {
  if (
    message.reciever_id == selected_reciever.id ||
    message.sender_id == selected_reciever.id
  ) {
    console.log(message);
    setMessageItem(message);
  }
});

socket.on("newMessage", (message) => {
  let currentUserId = getAuthUser().id;
  let id = null;
  if (message.reciever_id == currentUserId) id = message.sender_id;
  else id = message.sender_id;
  manageConversationList(id);
});
