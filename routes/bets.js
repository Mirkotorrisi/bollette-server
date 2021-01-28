const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const { fixTeams, getMultiplier } = require("../middlewares/utilities");
const auth = require("../middlewares/auth");
const {
  insertBolletta,
  decrementUserSum,
  getUserSum,
  insertBet,
} = require("../middlewares/dbQuery");

let tickets = {};
router.post("/", async ({ body: { match, odd, ticket_id } }, res) => {
  try {
    if (!ticket_id) {
      ticket_id = Number(new Date().getTime().toString().substring(8));
      tickets[ticket_id] = [];
    }
    if (
      availableBetList &&
      availableBetList[match] &&
      availableBetList[match].odds[odd] &&
      tickets[ticket_id]
    ) {
      tickets[ticket_id] = tickets[ticket_id].filter(({ teams }) => {
        return (
          JSON.stringify(availableBetList[match].teams) !==
          JSON.stringify(teams)
        );
      });
      tickets[ticket_id].push({
        teams: availableBetList[match].teams,
        start: availableBetList[match].start,
        result: odd,
        odd: availableBetList[match].odds[odd],
        won: false,
      });
      res.json({
        ticket: tickets[ticket_id],
        checkout: {
          ticket_id,
          multiplier: getMultiplier(tickets[ticket_id]),
        },
      });
    } else {
      res.status(400).send("Not a valid bet (1,X,2)");
    }
  } catch (err) {
    res.status(500).send("Internal server error... sorry");
  }
});
router.delete(
  "/",
  body("match").toInt().isInt({ min: 0 }).withMessage("Invalid bet"),
  body("ticket_id").toInt().isInt({ min: 0 }).withMessage("Invalid ticket id"),
  handleErrors,
  ({ body: { match, ticket_id } }, res) => {
    tickets[ticket_id].splice(match, 1);
    res.json({
      ticket: tickets[ticket_id],
      checkout: { ticket_id, multiplier: getMultiplier(tickets[ticket_id]) },
    });
  }
);
router.post(
  "/checkout/:ticket_id",
  auth,
  body("betImport")
    .toInt()
    .isInt({ min: 2 })
    .withMessage("Invalid bet import, can't be less than 2$"),
  param("ticket_id")
    .isIn(tickets)
    .withMessage("Sorry we don't find this ticket"),
  handleErrors,
  async ({ params: { ticket_id }, body: { betImport }, user: { id } }, res) => {
    const multiplier = getMultiplier(tickets[ticket_id]);
    const maxWin = (multiplier * betImport).toFixed(2);
    try {
      let account_sum = await getUserSum(id);
      if (account_sum[0].account_sum < betImport)
        return res
          .status(402)
          .send(
            `Sorry, your balance is not enough to place this bet (${account_sum[0].account_sum}$)`
          );
      else await insertBolletta(ticket_id, betImport, maxWin, id);
      await decrementUserSum(betImport, id);
      account_sum = await getUserSum(id);
      let values = tickets[ticket_id].map(({ teams, odd, result, start }) => {
        teams = fixTeams(teams);
        return [
          teams[0],
          teams[1],
          result,
          odd.toString(),
          ticket_id,
          new Date(start * 1000).toISOString().slice(0, 19).replace("T", " "),
        ];
      });
      await insertBet(values);
      res.json({
        import: betImport,
        multiplier,
        maxWin,
        ticket_id,
        account_sum: account_sum[0].account_sum,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error... sorry");
    }
  }
);
module.exports = router;
