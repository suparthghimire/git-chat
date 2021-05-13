const jwt = require("jsonwebtoken");

module.exports = {
  checkAuth: (req, res, next) => {
    let jwtToken = req.cookies.jwt_gitchat;
    if (jwtToken) {
      jwt.verify(jwtToken, process.env.JWT_SECRET, (error, decodedToken) => {
        if (error) {
          // res.status(401).json({ error: "Error!", error });
          res.redirect("/");
        } else {
          next();
        }
      });
    } else {
      res.redirect("/");
    }
  },
};
