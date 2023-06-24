module.exports = require('mongoose').model('PartnerOrder', {
    from: {
        type: require('mongoose').Schema.ObjectId,
        ref: 'Admin'
    },
    client: {
        type: require('mongoose').Schema.ObjectId,
        ref: 'Client'
    },
    about: String,
    mortgage: Number,
    price: Number,
    day: Number,
    month: Number,
    services: String,
    year: Number,
    createdAt: Number,
    viewed: {
        type: Boolean,
        default: true
    }
});