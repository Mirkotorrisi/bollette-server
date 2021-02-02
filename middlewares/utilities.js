const fixTeams = (teams) => {
  return teams.map((team) => {
    [
      "'",
      "nazionale",
      "Calcio",
      "CA",
      "CF",
      "BC",
      "AC",
      "FC",
      "SSC",
      "and",
      "&",
      "AS",
      "SAD",
      "CP",
      "Lisbon",
      /[0-9]/g,
    ].map((toDel) => (team = team?.replace(toDel, "")));
    return team?.trim();
  });
};
const getMultiplier = (ticket) => {
  let res = 1;
  ticket.map((item) => {
    res *= item.odd;
  });
  return res;
};
module.exports = { fixTeams, getMultiplier };
