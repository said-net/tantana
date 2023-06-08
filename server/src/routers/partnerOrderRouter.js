const partnerOrderController = require('../controllers/partnerOrderController');
const adminAuth = require('../middlewares/adminAuth');

module.exports = require('express')()
    .post('/create-order', adminAuth, partnerOrderController.create)
    .get('/getall-orders', adminAuth, partnerOrderController.getAll)