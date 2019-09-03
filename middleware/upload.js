const multer = require('multer');
const fileFilter = require("./fileFilter");
const storage = require("./storage");

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

module.exports = upload