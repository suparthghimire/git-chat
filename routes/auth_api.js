const { Router } = require("express");
const router = Router();

const AuthController = require("../controllers/AuthController");
router.post("/login", AuthController.login);
router.get("/login/callback", AuthController.loginCallback);
router.get("/logout", AuthController.logout);

module.exports = router;
