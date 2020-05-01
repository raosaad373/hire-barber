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

router.patch("/:barberId", checkAuth, (req, res, next) => {
    // Validate Request
    if(!req.params.barberId) {
        return res.status(400).send({
            message: "Shop content can not be empty"
        });
    }
  
    // Find note and update it with the request body
    Barber.findByIdAndUpdate(req.params.barberId, {
        name: req.body.name,
        shop_name: req.body.shop_name,
        shop_address: req.body.shop_address
    }, {new: true})
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Shop not found with id " + req.params.barberId
            });
        }
        res.send('Shops Details Updated');
    }).catch(err => {
        if(err.kind === 'PbarberId') {
            return res.status(404).send({
                message: "Shop not found with id " + req.params.barberId
            });                
        }
        return res.status(500).send({
            message: "Error updating shop with id " + req.params.barberId
        });
    });
  });

module.exports = router;