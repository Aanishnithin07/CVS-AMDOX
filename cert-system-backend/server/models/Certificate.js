const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    certificateId: {
        type: String,
        required: true,
        unique: true
    },
    studentName: {
        type: String,
        required: true
    },
    internshipDomain: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isRevoked: {
        type: Boolean,
        default: false
    }
});

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;
