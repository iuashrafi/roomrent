const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

/**
 *
 * @param {*} req
 * @returns user data from token
 * @description function to fetch user data from request's token
 */
const getUserDataFromReq = (req) => {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, JWT_SECRET, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
};

module.exports = { getUserDataFromReq };
