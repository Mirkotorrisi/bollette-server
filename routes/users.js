const express = require("express");
const router = express.Router();
const config = require("config");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const client = require("../middlewares/redisConfig");
router.use(cors({ origin: "*" }));
router.use(bodyParser.json());
const handleErrors = require("../middlewares/handleErrors");
const auth = require("../middlewares/auth");
const {
  getUserSum,
  getUser,
  getTicketsByUser,
  insertUser,
} = require("../middlewares/dbQuery");

const generateAuthToken = ({ id, username, email, account_sum }) => {
  return jwt.sign(
    { id, username, email, account_sum },
    config.get("jwtPrivateKey")
  );
};
router.post(
  "/register",
  body("email").isEmail().withMessage("Please provide a valid Email"),
  body("username")
    .isLength(6)
    .withMessage("Username must be at least 6 characters long"),
  body("password")
    .isLength(8)
    .withMessage("Password must be at least 8 characters long"),
  handleErrors,
  async ({ body: { username, email, password } }, res) => {
    try {
      const fetched = await getUser(email, username);
      if (fetched.length > 0)
        res.status(400).send("email or username already in use");
      else {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const { insertId } = await insertUser(username, email, hashed);
        const token = generateAuthToken({ id: insertId, username });
        client.set(user.id, token, "EX", 60 * 5, (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Internal server error, sorry.");
          }
          res
            .header("Access-Control-Expose-Headers", "x-auth-token")
            .header("x-auth-token", token)
            .json({ email, username, id: insertId, account_sum: 100 });
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error, sorry.");
    }
  }
);
router.post(
  "/login",
  body("usernameOrEmail").notEmpty(),
  body("password").notEmpty(),
  handleErrors,
  async ({ body: { usernameOrEmail, password } }, res) => {
    try {
      const userFetch = await getUser(usernameOrEmail, usernameOrEmail);
      if (userFetch.length === 0)
        res.status(400).send("invalid email or password");
      else {
        const validatePass = await bcrypt.compare(
          password,
          userFetch[0].password
        );

        if (validatePass) {
          const { password, ...user } = userFetch[0];
          const token = generateAuthToken(user);
          client.set(user.id, token, "EX", 60 * 5, (err, result) => {
            if (err) {
              console.log(err);
              return res.status(500).send("Internal server error, sorry.");
            }
            res
              .header("Access-Control-Expose-Headers", "x-auth-token")
              .header("x-auth-token", token)
              .json(user);
          });
        } else res.status(400).send("invalid email or password");
      }
    } catch (error) {
      return res.status(500).send("Internal server error, sorry.");
    }
  }
);
router.get("/account_sum", auth, async ({ user: { id } }, res) => {
  const userSum = await getUserSum(id);
  return res.json(userSum);
});
router.get("/tickets", auth, async ({ user: { id } }, res) => {
  try {
    const ticketsFetched = await getTicketsByUser(id);
    finalResult = [];
    ticketsFetched.forEach(
      ({ ticket_id, bolletta_status, bet_import, max_win }) => {
        finalResult[ticket_id] = {
          ticket_id,
          bolletta_status,
          bet_import,
          max_win,
          ticket: [],
        };
      }
    );
    ticketsFetched.forEach(
      ({
        ticket_id,
        bet_status,
        team_1,
        team_2,
        result,
        odd,
        commence_time,
      }) => {
        finalResult[ticket_id].ticket.push({
          bet_status,
          team_1,
          team_2,
          result,
          odd,
          commence_time,
        });
      }
    );
    res.json(finalResult.filter((i) => i !== null));
  } catch (error) {
    return res.status(500).send("Internal server error, sorry.");
  }
});
module.exports = router;
