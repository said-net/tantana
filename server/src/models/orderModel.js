module.exports = require('mongoose').model('Order', {
    client: {
        type: require('mongoose').Schema.ObjectId,
        ref: 'Client'
    },
    from: {
        type: require('mongoose').Schema.ObjectId,
        ref: 'Admin'
    },
    about: String,
    type: String,
    note: Number,
    status: String,
    year: Number,
    month: Number,
    day: Number,
    services: [{
        service: {
            type: require('mongoose').Schema.ObjectId,
            ref: 'Service'
        },
        price: Number
    }],
    mortgage: Number,
    createdAt: Number
});