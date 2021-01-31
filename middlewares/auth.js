const jwt = require("jsonwebtoken");
const config = require("config");
const client = require("../middlewares/redisConfig");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("No auth token provided");

  try {
    const verified = jwt.verify(token, config.get("jwtPrivateKey"));

    client.get(verified.id, (err, result) => {
      if (err) return res.status(500).send("Internal server error, sorry.");
      if (result && token === result) {
        client.set(verified.id, token, "EX", 60 * 10, (err, res) => {
          req.user = verified;
          next();
        });
      } else
        return res
          .status(401)
          .send("Session expired. Log in again to continue");
    });
  } catch (ex) {
    res.status(401).send("Invalid Token, log in to continue");
  }
};
