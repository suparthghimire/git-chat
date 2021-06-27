let selected_reciever = {
  id: null,
  uname: null,
  avatar: null,
};

import { getConversationChatList } from "./api.js";

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
          <ul class="reactions">
            <li class="reaction love" data-reaction_id="1" data-reaction_count="0" data-user_react="false" data-message_id=${message.id}>
              <i class="fas fa-heart"></i>
              <span class="reaction_count_1_${message.id}">0</span>
            </li>
            <li class="reaction haha" data-reaction_id="2" data-reaction_count="0" data-user_react="false" data-message_id=${message.id}>
              <i class="fas fa-laugh-squint"></i>
              <span class="reaction_count_2_${message.id}">0</span>
            </li>
            <li class="reaction wow" data-reaction_id="3" data-reaction_count="0" data-user_react="false" data-message_id=${message.id}>
              <i class="fas fa-surprise"></i>
              <span class="reaction_count_3_${message.id}">0</span>
            </li>
            <li class="reaction sad" data-reaction_id="4" data-reaction_count="0" data-user_react="false" data-message_id=${message.id}>
              <i class="fas fa-sad-tear"></i>
              <span class="reaction_count_4_${message.id}">0</span>
            </li>
            <li class="reaction angry" data-reaction_id="5" data-reaction_count="0" data-user_react="false" data-message_id=${message.id}>
              <i class="fas fa-angry"></i>
              <span class="reaction_count_5_${message.id}">0</span>
            </li>
            <li class="reaction like" data-reaction_id="6" data-reaction_count="0" data-user_react="false" data-message_id=${message.id}>
              <i class="fas fa-thumbs-up"></i>
              <span class="reaction_count_6_${message.id}">0</span>
            </li>
            <li class="reaction dislike" data-reaction_id="7" data-reaction_count="0" data-user_react="false" data-message_id=${message.id}>
              <i class="fas fa-thumbs-down"></i>
              <span class="reaction_count_7_${message.id}">0</span>
            </li>
          </ul>
    `;
  messageList.appendChild(li);
};

const reactionInteraction = () => {
  const reactions = document.querySelectorAll(".reaction");
  reactions.forEach((reaction) => {
    reaction.addEventListener("click", () => {
      let userReact = reaction.dataset.user_react == "false" ? false : true;
      let reactionCount = parseInt(reaction.dataset.reaction_count);
      const messageId = reaction.dataset.message_id;
      const userId = getAuthUser().id;
      const reactionId = reaction.dataset.reaction_id;
      if (!userReact) reactionCount++;
      else reactionCount--;
      reaction.dataset.user_react = !userReact;
      reaction.dataset.reaction_count = reactionCount;
      document.querySelector(
        `.reaction_count_${reactionId}_${messageId}`
      ).textContent = reactionCount;
      const reactionData = {
        reaction: parseInt(reactionId),
        MessageModelId: messageId,
        UserModelId: userId,
      };
      socket.emit("reactionSave", reactionData);
    });
  });
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
  reactionInteraction();
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
const selectUserEvent = (e, user) => {
  fetchUserChatMessages(e);
  selected_reciever.id = user.id;
  selected_reciever.uname = user.username;
  selected_reciever.avatar = user.avatar_url;
  let sender_id = getAuthUser().id;
  const selected_reciever_id = selected_reciever.id;
  let room = generateRoomId(sender_id, selected_reciever_id);
  socket.emit("joinRoomDM", room);
};

const setConversationItem = (item, chatList) => {
  const logged_in_userId = getAuthUser().id;
  let user = {};

  if (!item.sender_id) {
    user.id = item.reciever_id;
    user.username = item.reciever_name;
    user.avatar_url = item.reciever_avatar;
  } else {
    if (item.sender_id == logged_in_userId) {
      user.id = item.reciever_id;
      user.username = item.reciever_name;
      user.avatar_url = item.reciever_avatar;
    } else if (item.reciever_id == logged_in_userId) {
      user.id = item.sender_id;
      user.username = item.sender_name;
      user.avatar_url = item.sender_avatar;
    }
  }

  const li = document.createElement("li");
  li.classList.add("chat-item");
  li.id = user.id;
  li.innerHTML = `
    <div class="display-img" id="${user.id}">
      <img src="${user.avatar_url}"  id="${user.id}" alt="${user.username}">
    </div>
    <div class="chat-user" id="${user.id}">
      <div class="username" id="${user.id}">
        ${user.username}
      </div>
    </div>
        `;
  li.addEventListener("click", (e) => {
    selectUserEvent(e, user);
  });
  chatList.appendChild(li);
};

const renderConversationList = (data) => {
  const chatList = document.querySelector(".chat-list");
  chatList.innerHTML = "";
  data.forEach((item) => {
    setConversationItem(item, chatList);
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
      reciever_name: selected_reciever.uname,
      message: messageContent,
    };
    manageConversationList(selected_reciever.id);
    socket.emit("messageSent", message);
  });
};

const renderSearchList = (data) => {
  const searchList = document.querySelector(".search-list");
  searchList.innerHTML = "";
  data.forEach((item) => {
    setConversationItem(item, searchList);
  });
};

const re_renderConversationList = (data) => {
  let chatList = document.querySelector(".chat-list");
  chatList.innerHTML = "";
  data.forEach((item) => {
    let avatar = item.children[0].children[0].src;
    let username = item.children[1].children[0].innerHTML.trim();
    let id = item.id;
    let obj = {
      reciever_avatar: avatar,
      reciever_name: username,
      reciever_id: id,
    };
    setConversationItem(obj, chatList);
  });
};
const manageConversationList = (id) => {
  let li = document.getElementById(id);
  if (li != null) {
    const chatList = document.querySelector(".chat-list");
    let items = Array.from(chatList.children);
    let nodeIndex = items.findIndex((item) => item.id == id);
    let node;
    if (nodeIndex != -1) node = items.splice(nodeIndex, 1)[0];
    else node = li;
    items.unshift(node);
    re_renderConversationList(items);
  } else {
    getConversationChatList();
  }
};

export {
  renderChatMessages,
  renderUserInformation,
  renderConversationList,
  reactionInteraction,
  renderSearchList,
  chatMessage,
  setMessageItem,
  socket,
  selected_reciever,
  setConversationItem,
  manageConversationList,
  getAuthUser,
};
