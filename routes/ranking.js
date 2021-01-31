const express = require("express");
const router = express.Router();
const { param } = require("express-validator");
const handleErrors = require("../middlewares/handleErrors");
const { getRanking, getBestMultiplier } = require("../middlewares/dbQuery");

router.get("/", async (_, res) => {
  const ranking = await getRanking();
  res.json(ranking);
});
router.get("/multiplier", async (_, res) => {
  const ranking = await getBestMultiplier();
  res.json(ranking);
});
//TODO needs authentication
// router.get(
//   "/:ticket_id",
//   param("ticket_id").toInt().isInt({ min: 0 }),
//   handleErrors,
//   async ({ params: { ticket_id } }, res) => {
//     db.query(
//       `SELECT * FROM bet WHERE (ticket_id = ${ticket_id});`,
//       (err, fetched) => {
//         if (err) return res.status(400).send(err.sqlMessage);
//         if (fetched.length < 1) return res.status(404).send("No ticket found");
//         db.query(
//           `SELECT * FROM bolletta WHERE (ticket_id = ${ticket_id});`,
//           (err, bollette_results) => {
//             if (err) return res.status(500).send(err.sqlMessage);
//             res.json({ fetched, bollette_results });
//           }
//         );
//       }
//     );
//   }
// );

module.exports = router;
