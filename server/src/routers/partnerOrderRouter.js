const partnerOrderController = require('../controllers/partnerOrderController');
const adminAuth = require('../middlewares/adminAuth');

module.exports = require('express')()
    .post('/create-order', adminAuth, partnerOrderController.create)
    .post('/create-from-operator', adminAuth, partnerOrderController.createFromOperator)
    .get('/getall-orders', adminAuth, partnerOrderController.getAll)
    .get('/get-notes', adminAuth, partnerOrderController.getNotes)
    .put('/set-status/:id', adminAuth, partnerOrderController.setStatus)