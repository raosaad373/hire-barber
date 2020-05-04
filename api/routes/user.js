const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require('../middleware/check-auth');
const User = require("../models/user");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null,file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


router.post("/signup",upload.single('userImage'), (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "User already exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              email: req.body.email,
              password: hash,
              user_type: req.body.user_type,
              city: req.body.city,
              contact_no: req.body.contact_no,
              address: req.body.address,
              userImage: req.file.path

            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(200).json({
                  message: "User created successfully",
                  user: result
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "User does not exist. Please signup"
        });
      }
      if(user.user_type!= req.body.user_type){
        return res.status(401).json({
          message: `Incorrect user type`
        });
      }
      else{
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Incorrect password"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id
            },
            'secret',
            {
                expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message:  `Welcome ${user.name}. You are now logged in.`,
            token: token,
            user
          });
        }
        res.status(401).json({
          message: "Incorrect password"
        });
      });
    }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.patch("/:userId",  (req, res, next) => {
  // Validate Request
  if(!req.params.userId) {
      return res.status(400).send({
          message: "This user does not exist"
      });
  }

  // Find note and update it with the request body
  User.findByIdAndUpdate(req.params.userId, {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    user_type: req.body.user_type,
    city: req.body.city,
    contact_no: req.body.contact_no,
    address: req.body.address
  }, {new: true})
  .then(note => {
      if(!note) {
          return res.status(404).send({
              message: "User not found with id " + req.params.userId
          });
      }
      return res.status(200).send({
        message: "User not found with id " + req.params.userId
    });
  }).catch(err => {
      if(err.kind === 'userId') {
          return res.status(404).send({
              message: "User not found with id " + req.params.userId
          });                
      }
      return res.status(500).send({
          message: "Error updating User with id " + req.params.userId
      });
  });
});

router.delete("/:userId",checkAuth, (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User has been deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;