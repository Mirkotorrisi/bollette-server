const { validationResult } = require("express-validator");

module.exports = handleErrors = (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    err.errors = err.errors.reduce((acc, { msg }) => (acc += msg + "-"), "");
    return res.status(400).send(err.errors);
  } else {
    next();
  }
};
