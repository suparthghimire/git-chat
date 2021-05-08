const express = require("express");
const path = require("path");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use("/", require("./routes/pages"));
app.use("/auth/", require("./routes/auth_api"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Started at PORT: ${PORT}`);
});
