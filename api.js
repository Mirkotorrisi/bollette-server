const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("config");
const cron = require("node-cron");

const users = require("./routes/users");
const championships = require("./routes/championships");
const bets = require("./routes/bets");
const yourbet = require("./routes/yourbet");
const updateMatchResults = require("./middlewares/updateMatchResults");

require("./prod")(app);
if (
  !config.get("jwtPrivateKey") ||
  !config.get("the_odds_api_key") ||
  !config.get("db_password") ||
  !config.get("db_username")
) {
  console.error("FATAL ERROR: PRIVATE KEY NOT DEFINED!");
  process.exit(1);
}

cron.schedule("*/10 * * * *", () => {
  updateMatchResults();
});

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use("/users", users);
app.use("/championships", championships);
app.use("/bets", bets);
app.use("/yourbet", yourbet);

module.exports = app.listen(3001, () => {
  console.log(`Example app listening at http://localhost:3001`);
});
