const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    image: { type: String, required: true },
});

module.exports = mongoose.model('Contact', contactSchema);