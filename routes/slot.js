const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../middlewares/auth");
const {
  decrementUserSum,
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

module.exports = router;
