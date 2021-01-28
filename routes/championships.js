const express = require("express");
const router = express.Router();
const fetchOdds = require("../middlewares/fetchOdds");
const { param } = require("express-validator");
const handleErrors = require("../middlewares/handleErrors");

const sport_keys = {
  premier_league: "soccer_epl",
  serie_a: "soccer_italy_serie_a",
  serie_b: "soccer_italy_serie_b",
  ligamax: "soccer_mexico_ligamx",
  bundesliga: "soccer_germany_bundesliga",
  eredivisie: "soccer_netherlands_eredivisie",
  primeira_liga: "soccer_portugal_primeira_liga",
  la_liga: "soccer_spain_la_liga",
  ligue_one: "soccer_france_ligue_one",
  champions_league: "soccer_uefa_champs_league",
  europa_league: "soccer_uefa_europa_league",
};
let availableBetList;

router.get(
  "/:championship",
  param("championship")
    .isIn(Object.keys(sport_keys))
    .withMessage("We don't have this championship sorry"),
  handleErrors,
  async ({ params: { championship } }, res) => {
    try {
      availableBetList = await fetchOdds(sport_keys[championship]);
      res.json(availableBetList);
    } catch (err) {
      res.status(500).send("Internal server error... sorry");
    }
  }
);

module.exports = router;
