const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/img/players/");
  }
  // ,
  // filename: function(req, file, cb) {
  //   cb(null,`${file.originalname}.jpg`);
  // }
});

module.exports = storage;