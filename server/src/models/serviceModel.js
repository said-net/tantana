module.exports = require('mongoose').model('Service', {
    title: {
        type: String,
        unique: true
    },
    about: String,
    hidden: {
        type: Boolean,
        default: false
    }
});