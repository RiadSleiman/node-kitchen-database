const mongoose = require('mongoose');

const cvDescriptionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    description: {type: String, required: true}, 
});

module.exports = mongoose.model('CvDescription', cvDescriptionSchema);