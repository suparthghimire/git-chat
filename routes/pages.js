const { Router } = require("express");
const { checkAuth } = require("../middleware/AuthMiddleware");
const router = Router();

router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;
