const jwt = require("jsonwebtoken");
const { sequelize } = require("../models/index");
const UserModel = require("../models/index").UserModel;

const getAuthUserId = (req) => {
  let jwtToken = req.cookies.jwt_gitchat;
  if (jwtToken) {
    return jwt.verify(
      jwtToken,
      process.env.JWT_SECRET,
      (error, decodedToken) => {
        if (error) {
          return {
            message: "Error",
            data: error,
          };
        } else {
          return {
            message: "Success",
            data: decodedToken.payload.id,
          };
        }
      }
    );
  } else
    return {
      message: "Error",
      data: null,
    };
};

module.exports = {
  getUserData: (req, res) => {
    let jwtToken = req.cookies.jwt_gitchat;
    if (jwtToken) {
      jwt.verify(
        jwtToken,
        process.env.JWT_SECRET,
        async (error, decodedToken) => {
          if (error) {
            res.redirect("/");
          } else {
            let user = await UserModel.findOne({
              where: { id: decodedToken.payload.id },
            });
            res.status(200).json({ user });
          }
        }
      );
    }
  },
  getAllConversations: (req, res) => {
    let jwtToken = req.cookies.jwt_gitchat;
    if (jwtToken) {
      jwt.verify(
        jwtToken,
        process.env.JWT_SECRET,
        async (error, decodedToken) => {
          if (error) {
            res.redirect("/");
          } else {
            // let conversations = await sequelize.query(`
            //       select  sender_id, reciever_id, message_id, UserModels.github_name as reciever_name,
            //       MessageModels.message, UserModels.github_avatar_url as avatar_url, Conversations.createdAt from Conversations
            //       INNER join MessageModels on MessageModels.id = Conversations.message_id
            //       INNER join UserModels on UserModels.id = Conversations.reciever_id
            //       where sender_id = ${decodedToken.payload.id}
            //       group by reciever_id ORDER by Conversations.createdAt DESC
            //   `);
            let conversations = await sequelize.query(`
              SELECT 
              F.sender_id, 
              F.reciever_id, 
              F.message_id, 
              U1.github_name as sender_name,
              U2.github_name as reciever_name,
              U1.github_avatar_url as sender_avatar,
              U2.github_avatar_url as reciever_avatar,
              M.message, 
              F.createdAt
              FROM 
                (
                  SELECT * 
                  FROM Conversations as C
                  WHERE (MIN(C.sender_id, C.reciever_id), MAX(C.sender_id, C.reciever_id), C.createdAt)
                    IN	(
                        SELECT MIN(B.sender_id, B.reciever_id) AS X,
                            MAX (B.sender_id, B.reciever_id) AS Y,
                              MAX(B.createdAt) as time
                        FROM Conversations as B
                        GROUP BY X,Y
                      )
                ) as F
                INNER JOIN UserModels as U1 on U1.id = F.sender_id
                INNER JOIN UserModels as U2 on U2.id = F.reciever_id
                INNER JOIN MessageModels as M on M.id = F.message_id
                WHERE ${decodedToken.payload.id} IN (F.sender_id, F.reciever_id)
                ORDER BY F.createdAt DESC
              `);

            conversations = conversations[0];
            res.status(200).json(conversations);
          }
        }
      );
    }
  },
  getAllMessages: async (req, res) => {
    let user_token = getAuthUserId(req);
    if (
      user_token.message == "Error" ||
      !user_token.data ||
      user_token.data == null
    ) {
      return res.status(400).json(user_token);
    } else {
      try {
        const sender_id = user_token.data;
        const reciever_id = parseInt(req.body.id);
        let allConversation = await sequelize.query(
          `
          select Conversations.id, sender_id, message_id, reciever_id,
          UserModels.github_name as reciever_name,
          UserModels.github_avatar_url as reciever_avatar,
          MessageModels.message, Conversations.createdAt from Conversations 
          inner join UserModels on UserModels.id = Conversations.reciever_id
          inner join MessageModels on MessageModels.id = Conversations.message_id
          where sender_id = ${sender_id} and reciever_id = ${reciever_id}
          or sender_id = ${reciever_id} and reciever_id = ${sender_id}
          order by Conversations.createdAt ASC
        `
        );
        allConversation = allConversation[0];
        return res.status(200).json(allConversation);
      } catch (error) {
        console.error(error);
      }
    }
  },
  search: async (req, res) => {
    const query = req.body.query;
    try {
      let searchData = await sequelize.query(
        `
          SELECT
          id as reciever_id,
          github_name as reciever_name,
          github_avatar_url as reciever_avatar
          from UserModels
          where github_name like "%${query}%";
        `
      );
      searchData = searchData[0];
      return res.status(200).json(searchData);
    } catch (error) {
      console.error(err);
    }
    console.log(query);
  },
};
