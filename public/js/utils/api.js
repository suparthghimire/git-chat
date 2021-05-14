import {
  chatMessage,
  renderUserInformation,
  renderConversationList,
  renderSearchList,
  socket,
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
  let currentUsername = user.github_name;
  socket.emit("joinCommonRoom", { currentUsername });
  renderUserInformation();
  getConversationChatList();
  chatMessage();
};

const searchUser = async (query) => {
  try {
    console.log(query);
    const response = await fetch(`/rooms/search`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/JSON",
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    renderSearchList(data);
  } catch (error) {
    console.error(error);
  }
};

const searchBox = document.querySelector("#search");
searchBox.addEventListener(
  "input",
  _.debounce(() => {
    searchUser(searchBox.value);
  }, 300)
);

export { getConversationChatList, getUser };
