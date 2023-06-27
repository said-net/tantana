module.exports = require('mongoose').model('Eductaion', {
    client: {
        type: require('mongoose').Schema.ObjectId,
        ref: 'Client'
    },
    from: {
        type: require('mongoose').Schema.ObjectId,
        ref: 'Admin'
    },
    type: String,
    region: Number,
    city: Number,
    education: String,
    class_room: String,
    students: Number,
    services: [{
        service: {
            type: require('mongoose').Schema.ObjectId,
            ref: 'Service'
        },
        price: Number
    }],
    mortgage: Number,
    status: {
        type: String,
        default: 'pending'
    },
    year: Number,
    month: Number,
    day: Number,
    created: Number,
});