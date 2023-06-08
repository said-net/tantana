const clientController = require('../controllers/clientController');
const adminAuth = require('../middlewares/adminAuth');

module.exports = require('express')()
    .get('/getall', adminAuth, clientController.getAll)
    .get('/getfrompartners', adminAuth, clientController.getFromPartners)
    .get('/getallorders/:id', adminAuth, clientController.getAllOrders)
    .post('/create', adminAuth, clientController.create)