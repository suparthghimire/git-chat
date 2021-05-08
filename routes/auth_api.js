const { Router } = require("express");
const router = Router();

const AuthController = require("../controllers/AuthController");
router.get("/login", AuthController.login);

module.exports = router;
