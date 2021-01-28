const { fixTeams } = require("../middlewares/utilities");
const { spawn } = require("child_process");
const db = require("../middlewares/db");
const {
  updateBetStatus,
  updateBollettaStatus,
  updateUserSum,
  updateBollettaPaid,
} = require("../middlewares/dbQuery");

module.exports = updateMatchResults = async () => {
  let matchResults;
  const python = spawn("py", ["scraper.py"]);
  python.stdout.on("data", async function (data) {
    try {
      console.log("got data from scraping");
      matchResults = data
        .toString()
        .split("\r\n")
        .map(async (item) => {
          const temp_item = item.split("-");
          let [team_1, team_2] = fixTeams([temp_item[0], temp_item[1]]);
          if (temp_item.length === 3)
            await updateBetStatus(temp_item[2], team_1, team_2).catch((err) =>
              console.log(err)
            );
          return team_1 + "-" + team_2 + " " + temp_item[2];
        });
      await updateBollettaStatus();
      await updateUserSum();
      await updateBollettaPaid();
    } catch (error) {
      console.log(error);
    }
  });
  python.on("close", () => {
    console.log("end of all");
    return matchResults;
  });
};