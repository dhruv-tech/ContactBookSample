
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, index: {
        unique: true,
        collation: { locale: 'en', strength: 2 }
      }}
});

module.exports = mongoose.model('Contact', contactSchema);