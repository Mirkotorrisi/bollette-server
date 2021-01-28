const express = require("express");
const router = express.Router();
const { param } = require("express-validator");
const handleErrors = require("../middlewares/handleErrors");
const db = require("../middlewares/db");
const updateMatchResults = require("../middlewares/updateMatchResults");

router.get("/results", async (_, res) => {
  //useless
  const matchResults = await updateMatchResults();
  res.json(matchResults);
});
//TODO needs authentication
router.get(
  "/:ticket_id",
  param("ticket_id").toInt().isInt({ min: 0 }),
  handleErrors,
  async ({ params: { ticket_id } }, res) => {
    db.query(
      `SELECT * FROM bet WHERE (ticket_id = ${ticket_id});`,
      (err, fetched) => {
        if (err) return res.status(400).send(err.sqlMessage);
        if (fetched.length < 1) return res.status(404).send("No ticket found");
        db.query(
          `SELECT * FROM bolletta WHERE (ticket_id = ${ticket_id});`,
          (err, bollette_results) => {
            if (err) return res.status(500).send(err.sqlMessage);
            res.json({ fetched, bollette_results });
          }
        );
      }
    );
  }
);

module.exports = router;
