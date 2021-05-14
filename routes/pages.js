const { Router } = require("express");
const { checkNoAuth } = require("../middleware/AuthMiddleware");
const router = Router();

router.get("/", checkNoAuth, (req, res) => {
  res.render("index");
});

module.exports = router;
