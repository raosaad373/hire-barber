const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require('../middleware/check-auth');
const User = require("../models/user");

router.get("/feed", (req, res, next) => {
    User.find()
      .select("name email user_type city contact_no address ")
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          users: docs.map(doc => {
            if(doc.user_type === "Barber" ){
            return {
              name: doc.name,
              email: doc.email,
              user_type: doc.user_type,
              city: doc.city,
              contact_no: doc.contact_no,
              address: doc.address,
              _id: doc._id,
            };
          }
          })
        };
        //   if (docs.length >= 0) {
        res.status(200).json(response);
        //   } else {
        //       res.status(404).json({
        //           message: 'No entries found'
        //       });
        //   }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

module.exports = router;


