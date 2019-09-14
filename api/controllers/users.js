const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { validationResult } = require("express-validator/check");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const transporter = require("../../config/mail");

module.exports = {
  create: async (req, res, next) => {
    const { name, email, password } = req.body;
    await userModel
      .create({
        name,
        email,
        password
      })
      .then(() => {
        res.json({
          status: "success",
          message: "User added successfully!!!",
          data: null
        });
      })
      .catch(err => {
        next(err);
      });
  },
  signup: async (req, res, next) => {
    const { name, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    try {
      let userInfo = await userModel.findOne({ email });
      if (userInfo) {
        res.status(400).json({ message: "Email Already Exist!!!" });
      } else {
        await userModel
          .create({
            name,
            email,
            password
          })
          .then(() => {
            transporter.sendMail({
              to: email,
              from: "teamsports@teamsports.com",
              subject: "Signup succeeded!",
              html: "<h1>You successfully signed up!</h1>"
            });
            res.json({
              status: "success",
              message: "User added successfully!!!",
              data: null
            });
          });
      }
    } catch (err) {
      next(err);
    }
  },
  authenticate: function(req, res, next) {
    const { name, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    try{
      let userInfo = await userModel.findOne({ email });
      if ( userInfo != null && bcrypt.compareSync(password, userInfo.password)) {
        const token = jwt.sign(
          { id: userInfo._id },
          config.get("jwtSecret"),
          { expiresIn: "1h" }
        );

        res.status(200).json({
          status: "success",
          message: "user found!!!",
          data: { user: userInfo, token: token }
        });
      } else {
        res.status(400).json({ message: "Invalid email/password!!!"});
      }
    } catch(err){
      next(err)
    }
  }
};

/* module.exports = {
  create: function(req, res, next) {
    userModel.create(
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      },
      function(err, result) {
        if (err) next(err);
        else
          res.json({
            status: "success",
            message: "User added successfully!!!",
            data: null
          });
      }
    );
  },
  signup: function(req, res, next) {
    const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
		}
    userModel.findOne({ email: req.body.email }, function(err, userInfo) {
      if (err) {
        next(err);
      } else {
        if (userInfo) {
          res.json({
            status: "error",
            message: "Email Already Exist!!!",
            data: null
          });
        } else {
          userModel.create(
            {
              name: req.body.name,
              email: req.body.email,
              password: req.body.password
            },
            function(err, result) {
              if (err) next(err);
              else
                {
                  transporter.sendMail({
                    to: req.body.email,
                    from: 'teamsports@teamsports.com',
                    subject: 'Signup succeeded!',
                    html: '<h1>You successfully signed up!</h1>'
                  });
                  res.json({
                  status: "success",
                  message: "User added successfully!!!",
                  data: null
                });
              }
            }
          );
        }
      }
    });
  },
  authenticate: function(req, res, next) {
    userModel.findOne({ email: req.body.email }, function(err, userInfo) {
      if (err) {
        next(err);
      } else {
        if (
          userInfo != null &&
          bcrypt.compareSync(req.body.password, userInfo.password)
        ) {
          const token = jwt.sign(
            { id: userInfo._id },
            config.get("jwtSecret"),
            { expiresIn: "1h" }
          );

          res.json({
            status: "success",
            message: "user found!!!",
            data: { user: userInfo, token: token }
          });
        } else {
          res.json({
            status: "error",
            message: "Invalid email/password!!!",
            data: null
          });
        }
      }
    });
  }
}; */
