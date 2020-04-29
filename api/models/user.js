const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true },
    user_type: {
        type: String,
        enum : ['Customer','Barber'], 
        default: 'Customer',
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contact_no: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);