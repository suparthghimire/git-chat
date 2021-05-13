const main = document.querySelector("main");
const aside = document.querySelector(".users-section");
const nav_btn = document.querySelector("#open_aside");
const nav_icon = document.querySelector(".nav-btn");

console.log(nav_btn);

nav_btn.addEventListener("click", () => {
  aside.classList.toggle("user-section-change");
  main.classList.toggle("main_nav_change");
});
