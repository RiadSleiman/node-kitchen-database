const mongoose = require('mongoose');

const cvTitleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true}, 
});

module.exports = mongoose.model('CvTitle', cvTitleSchema);