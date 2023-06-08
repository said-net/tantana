const orderController = require('../controllers/orderController');
const adminAuth = require('../middlewares/adminAuth');

module.exports = require('express')()
    .post('/create', adminAuth, orderController.create)
    .get('/getall', adminAuth, orderController.getAll)
    .get('/getnotes/:note/:status', adminAuth, orderController.getNotes)
    .put('/setstatus/:id', adminAuth, orderController.setStatus)