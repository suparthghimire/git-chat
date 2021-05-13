const { Router } = require("express");
const { saveMessage } = require("../controllers/MessageController");
const router = Router();

router.post("/save-message", saveMessage);
module.exports = router;
