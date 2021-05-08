console.log("Hello");

const login_github = document.querySelector("#login_from_github");
const login = () => {
  console.log("Github Login");
};
login_github.addEventListener("click", login, { once: true });
