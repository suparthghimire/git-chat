import {
  chatMessage,
  renderUserInformation,
  renderConversationList,
} from "./renderContent.js";
const getConversationChatList = async () => {
  try {
    const response = await fetch("/rooms/getUserConversation");
    const data = await response.json();
    if (!data) throw Error("Data Not Available!");
    renderConversationList(data);
  } catch (error) {
    console.error(error);
  }
};

const getUser = async () => {
  const api_response = await fetch("/rooms/getUserData");
  const { user } = await api_response.json();
  localStorage.setItem("auth-user", JSON.stringify(user));
  renderUserInformation();
  getConversationChatList();
  chatMessage();
};

export { getConversationChatList, getUser };
