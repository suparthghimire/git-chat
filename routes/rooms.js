const { Router } = require("express");
const {
  getUserData,
  getAllConversations,
  getAllMessages,
} = require("../controllers/RoomController");
const { checkAuth } = require("../middleware/AuthMiddleware");
const router = Router();

router.get("/", (req, res) => {
  res.render("rooms");
});
router.get("/getUserData", getUserData);
router.get("/getUserConversation", getAllConversations);
router.post("/getAllMessages", getAllMessages);
module.exports = router;
