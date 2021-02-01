const { fixTeams } = require("../middlewares/utilities");
const { spawn } = require("child_process");
const db = require("../middlewares/db");
const {
  updateBetStatus,
  updateBollettaStatus,
  updateUserSum,
} = require("../middlewares/dbQuery");

module.exports = updateMatchResults = async () => {
  let matchResults;
  const python = spawn("py", ["scraper.py"]);
  python.stdout.on("data", async (data) => {
    console.log("got data from scraping");
    matchResults = data
      .toString()
      .split("\r\n")
      .map(async (item) => {
        const temp_item = item.split("-");
        let [team_1, team_2] = fixTeams([temp_item[0], temp_item[1]]);
        if (temp_item.length === 3 && temp_item[2] !== undefined) {
          await updateBetStatus(
            temp_item[2][0],
            temp_item[3].trim(),
            team_1,
            team_2
          ).catch((err) => console.log(err));
        }
      });
  });

  python.on("error", (err) => {
    console.log("\n\t\tERROR: spawn failed! (" + err + ")");
  });
  python.on("close", async () => {
    console.log("update Bolletta status", await updateBollettaStatus());
    await updateUserSum();
    console.log("end of all");
    return matchResults;
  });
};
