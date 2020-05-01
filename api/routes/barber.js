const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require('../middleware/check-auth');
const Barber = require("../models/barber");

router.post("/create", checkAuth,  (req, res, next) => {
    const user = new Barber({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        shop_name: req.body.shop_name,
        shop_address: req.body.shop_address
      });
      user
        .save()
        .then(result => {
          console.log(result);
          res.status(200).json({
            message: "Shop Created",
            Shop: result
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