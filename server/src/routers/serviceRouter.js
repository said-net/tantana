const serviceController = require('../controllers/serviceController');
const adminAuth = require('../middlewares/adminAuth');

module.exports = require('express')()
    .post('/create', adminAuth, serviceController.create)
    .get('/getall', adminAuth, serviceController.getAll)
    .put('/edit/:id', adminAuth, serviceController.editService)
    .delete('/delete/:id', adminAuth, serviceController.hideService)