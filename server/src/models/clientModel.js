module.exports = require('mongoose').model('Client', {
    name: String,
    location: String,
    phone: String,
    from: {
        type: require('mongoose').Schema.ObjectId,
        ref: 'Admin'
    },
    created: Number
});