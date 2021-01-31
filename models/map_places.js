const mongoose = require('mongoose');

const map_placeSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    ratedBy: [{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    rating: {
        type: Number
    },
    lat: {
        type: Number
    },
    lan: {
        type: Number
    },
    type:{
        type: String
    }
},{
    timestamps: true
});

const places = mongoose.model('Places', map_placeSchema);
module.exports = places;