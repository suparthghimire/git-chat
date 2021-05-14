const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/index").UserModel;

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const saveUser = async (user) => {
  try {
    const user_in_db = await UserModel.findOne({
      where: { github_id: user.id },
    });
    if (user_in_db == null || !user_in_db) {
      let creationStatus = await UserModel.create({
        github_id: user.id,
        github_name: user.login,
        github_avatar_url: user.avatar_url,
        github_repository: user.public_repos,
        github_followers: user.followers,
        github_following: user.following,
        onlineStatus: true,
      });
      if (!creationStatus) throw Error("User Creation Failed");
      return creationStatus;
    } else {
      console.log("No Need to be saved");
      return user_in_db;
    }
  } catch (err) {
    console.error(err);
  }
};

const getAccessToken = async (code) => {
  try {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id,
          client_secret,
          code,
        }),
      }
    );
    const data = await response.text();
    const params = new URLSearchParams(data);
    return params.get("access_token");
  } catch (err) {
    console.error(err);
  }
};

const fetchUser = async (token) => {
  try {
    const request = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: "token " + token,
      },
    });
    const user = await request.json();
    return user;
  } catch (err) {
    console.error(err);
  }
};
const createToken = (payload) => {
  return jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.MAX_AGE,
  });
};
module.exports = {
  login: (req, res) => {
    const redirect_uri = "http://localhost:3000/auth/login/callback";
    const redirect_url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}`;
    res.redirect(redirect_url);
  },
  loginCallback: async (req, res) => {
    try {
      const code = req.query.code;
      const token = await getAccessToken(code);

      const user = await fetchUser(token);
      if (!user) throw "Authorization Failed!";
      else if (user) {
        const user_in_db = await saveUser(user);
        console.log(user);
        const appUser = {
          id: user_in_db.dataValues.id,
        };
        const jwtToken = createToken(appUser);
        res.cookie("jwt_gitchat", jwtToken, {
          httpOnly: true,
          maxAge: process.env.MAX_AGE * 1000,
        });
        return res.redirect("/rooms");
      }
    } catch (err) {
      res.json({
        message: "Authorization Failed",
        error: err,
      });
    }
  },
  logout: (req, res) => {
    res.cookie("jwt_gitchat", "", {
      maxAge: 1,
    });
    res.redirect("/");
  },
};
