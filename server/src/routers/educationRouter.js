const educationController = require('../controllers/educationController');
const adminAuth = require('../middlewares/adminAuth');

module.exports = require('express')()
.post('/create', adminAuth, educationController.create)
.get('/get-all', adminAuth, educationController.getAll)