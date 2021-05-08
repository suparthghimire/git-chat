const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.render("index");
});
router.get("/rooms", (req, res) => {
  res.render("rooms");
});

module.exports = router;
