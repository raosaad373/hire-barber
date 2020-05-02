const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require('../middleware/check-auth');
const Barber = require("../models/barber");
const User = require("../models/user");

router.get("/", checkAuth, (req, res, next) => {
  Barber.find()
  .populate('userId')
    .exec()
    .then(docs => {
      console.log(docs)
      if(docs.length==0){
        return res.status(404).json({
          message: "There is Nothing Available in Carts right-now"
        });
      }
      else{
      res.status(200).json({
        count: docs.length,
        Carts: docs.map(doc => {
          return {
            _id: doc._id,
            userId:doc.userId,
            name:doc.name,
            shop_name:doc.shop_name,
            shop_address:doc.shop_address,
            rating:doc.rating
          };
        })
      });
    }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post("/create", checkAuth,async (req, res) => {
  const {userId} = req.body //TODO: the logged in user id
  console.log(userId)
  try{
      let pro = await User.findById(userId)
      //console.log(pro)
      if(pro.user_type != "Barber"){
        return res.status(404).json({
          message: "You are not logged in as Barber. So can't able to create shop"
        });
      }
      else{
        const user = new Barber({
          _id: new mongoose.Types.ObjectId(),
          userId:req.body.userId,
          name: req.body.name,
          shop_name: req.body.shop_name,
          shop_address: req.body.shop_address,
          rating: req.body.rating
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
    }
  }
  catch (err) {
      console.log(err);
      return res.status(404).json({
        message: "You Must have to signup first"
      });
    }
 
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
        shop_address: req.body.shop_address,
        rating: req.body.rating
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