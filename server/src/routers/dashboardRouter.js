const dashboardController = require('../controllers/dashboardController');
const adminAuth = require('../middlewares/adminAuth');

module.exports = require('express')()
    .get('/getdashboard', adminAuth, dashboardController.getDashboard)