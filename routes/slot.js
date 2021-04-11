const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const auth = require("../middlewares/auth");
const {
  decrementUserSum,
  getUserSum,
  incrementUserSum
} = require("../middlewares/dbQuery");

router.post("/",  auth,
body("betImport")
.toInt()
.isInt({ min: 2 })
.withMessage("Invalid bet import, can't be less than 2$"),
body("numOfWheels")
.toInt()
.isInt({ min: 2 })
.withMessage("Invalid num of wheels"),
body("numOfSymbols")
.toInt()
.isInt({ min: 2 })
.withMessage("Invalid num of symbols, can't be less than 2$"),
async ({ body: { numOfWheels,numOfSymbols, betImport }, user: { id } }, res) => {
  try {
    await decrementUserSum(betImport, id);
    const results = Array.from({length: numOfWheels}, () => Math.floor(Math.random() * 100));
    const values = results.map((i) => i % numOfSymbols)
    let duplicates = values.filter((item, index) => values.indexOf(item) != index)
        if(duplicates.length > 0){
            const points = [-100, 1,5,10,5,5,5,50,10,7,5]
            const sum = duplicates.length === numOfWheels-1 ? points[duplicates[0]]**numOfWheels : points[duplicates[0]] * (duplicates.length+1)
            incrementUserSum(sum, id)
        }
      res.json({
        results,
        duplicates,
        sum?
      });
  } catch (err) {
    console.log(err)
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
