const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("config");
const cron = require("node-cron");

const users = require("./routes/users");
const championships = require("./routes/championships");
const bets = require("./routes/bets");
const ranking = require("./routes/ranking");
const updateMatchResults = require("./middlewares/updateMatchResults");

require("./prod")(app);
[
  "jwtPrivateKey",
  "the_odds_api_key",
  "db_password",
  "redis_url",
  "db_username",
].forEach((i) => {
  if (!config.get(i)) {
    console.error(`FATAL ERROR: ${i} NOT DEFINED!`);
    process.exit(1);
  }
});

cron.schedule("*/5 * * * *", () => {
  updateMatchResults();
});

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use("/users", users);
app.use("/championships", championships);
app.use("/bets", bets);
app.use("/ranking", ranking);

module.exports = app.listen(process.env.PORT || 3001, () => {
  console.log(`Example app listening at http://localhost:3001`);
});
