require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { checkAuth } = require("./middleware/AuthMiddleware");
const fs = require("fs");
const { sequelize } = require("./models/index");
const { saveUsers, saveMessage, saveConversation } = require("./utils/startup");
const { saveDirectConversation } = require("./utils/db_operation");
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  socket.on("joinCommonRoom", (room) => {
    socket.join(room.currentUsername);
    console.log("Room:", room.currentUsername);
  });

  let userRoom = null;
  socket.on("joinRoomDM", (room) => {
    socket.join(room);
    console.log("join DM room", room);
    userRoom = room;
  });
  socket.on("messageSent", async (message) => {
    try {
      if (await saveDirectConversation(message)) {
        console.log(message.reciever_name);
        const a = io.to(message.reciever_name).emit("newMessage", message);
        console.log(a);
        io.to(userRoom).emit("messageRecieve", message);
      }
    } catch (error) {
      console.error(error);
    }
  });
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, POST, DELETE");
    return res.status(200).json({});
  }
  next();
});
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use("/", require("./routes/pages"));
app.use("/auth/", require("./routes/auth_api"));

app.use("/rooms", checkAuth, require("./routes/rooms"));
app.use("/message", checkAuth, require("./routes/message_api"));

const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  try {
    if (!fs.existsSync("./database/db_chat_github.sqlite3"))
      await sequelize.sync({ force: true });
    // saveUsers();
    // saveMessage();
    // saveConversation();
  } catch (err) {
    console.log(err);
  }
  console.log(`Server Started at PORT: ${PORT}`);
});
