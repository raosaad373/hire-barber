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
    shop_address: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Barber', barberSchema);