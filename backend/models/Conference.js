
const mongoose = require('mongoose');

const ConferenceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },  
    completed: { type: Boolean, default: false },
    date: { type: Date },
    host: { type: String },
});

module.exports = mongoose.model('Conference', ConferenceSchema);