const mongoose = require('mongoose');

const barberSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    shop_name: { 
        type: String, 
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
    shop_address: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        max: 5,
        min: 0
    },
    shop_Image: { type: String, required: false }
});

module.exports = mongoose.model('Barber', barberSchema);