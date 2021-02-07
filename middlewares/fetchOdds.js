const axios = require("axios");
const config = require("config");

module.exports = fetchOdds = async (sport, mkt) => {
  const api_key = config.get("the_odds_api_key");
  const res = await axios.get("https://api.the-odds-api.com/v3/odds", {
    params: {
      api_key: api_key,
      sport,
      region: "eu", // uk | us | eu | au
      mkt, // h2h | spreads | totals
    },
  });
  availableBetList = res.data.data.map(
    ({ home_team, teams, sites, commence_time }) => {
      const ordered_teams = [
        home_team,
        teams.filter((team) => team !== home_team)[0],
      ];
      let odds;
      if (mkt === "h2h")
        odds =
          ordered_teams[0] === teams[0]
            ? {
                1: sites[0]?.odds.h2h[0],
                X: sites[0]?.odds.h2h[2],
                2: sites[0]?.odds.h2h[1],
              }
            : {
                1: sites[0]?.odds.h2h[1],
                X: sites[0]?.odds.h2h[2],
                2: sites[0]?.odds.h2h[0],
              };
      else if (mkt === "totals")
        odds = {
          over: sites[0]?.odds.totals.odds[0],
          under: sites[0]?.odds.totals.odds[1],
        };
      return {
        teams: ordered_teams,
        start: commence_time,
        odds,
      };
    }
  );

  return availableBetList;
};
