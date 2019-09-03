const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function validateUser(req, res, next) {
  jwt.verify(req.headers["x-access-token"], config.get("jwtSecret"), function(
    err,
    decoded
  ) {
    if (err) {
      res.json({ status: "error", message: err.message, data: null });
    } else {
      // add user id to request
      req.body.userId = decoded.id;
      next();
    }
  });
};
