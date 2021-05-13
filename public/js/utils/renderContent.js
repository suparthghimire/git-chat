let selected_reciever = {
  id: null,
  uname: null,
  avatar: null,
};

const socket = io();

const getAuthUser = () => {
  return JSON.parse(localStorage.getItem("auth-user"));
};

const setMessageItem = (message) => {
  const { id, github_avatar_url } = getAuthUser();
  let messageList = document.querySelector(".message-list");
  const li = document.createElement("li");
  let conversationStyleClassName = message.sender_id == id ? "self" : "other";
  li.classList.add("message-item", conversationStyleClassName);
  let imgSrc =
    message.reciever_id == id ? selected_reciever.avatar : github_avatar_url;
  li.innerHTML = `
      <div class="profile-img">
        <img src="${imgSrc}" />
      </div>
      <div class="msg-text ${conversationStyleClassName}-msg">
        ${message.message}
      </div>
    `;
  messageList.appendChild(li);
};

const renderChatMessages = (messages) => {
  const header_img = document.querySelector(".header-profile-img");
  const header_user_name = document.querySelector("#header_username");
  let messageList = document.querySelector(".message-list");

  header_img.src = selected_reciever.avatar;
  header_user_name.innerHTML = selected_reciever.uname;
  messageList.innerHTML = "";

  messages.forEach((message) => {
    const li = setMessageItem(message);
  });
};
const generateRoomId = (a, b) => {
  let x = a < b ? a : b;
  let y = a >= b ? a : b;
  let uniqueNum = (1 / 2) * (x + y) * (x + y + 1);
  return `room:${uniqueNum}`;
};

const fetchUserChatMessages = async (e) => {
  const id = e.target.id;
  try {
    const userChatResponse = await fetch("/rooms/getAllMessages", {
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "Application/JSON",
      },
      method: "POST",
    });
    const userChatData = await userChatResponse.json();
    renderChatMessages(userChatData);
  } catch (error) {
    console.error(error);
  }
};

const renderUserInformation = () => {
  const {
    github_name,
    github_avatar_url,
    github_followers,
    github_following,
    github_repository,
  } = getAuthUser();

  const username = document.querySelector("#username");
  const follower_count = document.querySelector("#followers");
  const following_count = document.querySelector("#following");
  const repository = document.querySelector("#repository");
  const image = document.querySelector("#avatar");
  username.textContent = github_name;
  following_count.textContent = github_following;
  follower_count.textContent = github_followers;
  repository.textContent = github_repository;
  image.src = github_avatar_url;
};

const renderConversationList = (data) => {
  const chatList = document.querySelector(".chat-list");
  chatList.innerHTML = "";
  data.forEach((item) => {
    const { reciever_id, reciever_name, avatar_url } = item;
    const li = document.createElement("li");
    li.classList.add("chat-item");
    li.id = reciever_id;
    li.innerHTML = `
        <div class="display-img" id="${reciever_id}">
          <img src="${avatar_url}"  id="${reciever_id}"alt="${reciever_name}">
        </div>
        <div class="chat-user" id="${reciever_id}">
          <div class="username" id="${reciever_id}">
            ${reciever_name}
          </div>
        </div>
        `;
    li.addEventListener("click", (e) => {
      fetchUserChatMessages(e);
      selected_reciever.id = reciever_id;
      selected_reciever.uname = reciever_name;
      selected_reciever.avatar = avatar_url;
      let { sender_id } = getAuthUser();
      const selected_reciever_id = selected_reciever.id;
      let room = generateRoomId(sender_id, selected_reciever_id);
      socket.emit("joinRoom", room);
    });
    chatList.appendChild(li);
  });
};

const chatMessage = () => {
  const form = document.querySelector("#chat-msg-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const messageContent = form.message_text.value;
    form.message_text.value = "";
    const { id } = getAuthUser();
    const message = {
      sender_id: id,
      reciever_id: selected_reciever.id,
      message: messageContent,
    };
    socket.emit("messageSent", message);
  });
};

export {
  renderChatMessages,
  renderUserInformation,
  renderConversationList,
  chatMessage,
  setMessageItem,
  socket,
  selected_reciever,
};
