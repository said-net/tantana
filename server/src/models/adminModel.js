module.exports = require('mongoose').model('Admin',{
    full_name: String,
    phone: {
        type: String,
        unique: true
    },
    password: String,
    access: String,
    role: String,
    hidden: {
        type: Boolean,
        default: false
    }
});