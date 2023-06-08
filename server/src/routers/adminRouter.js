const adminController = require('../controllers/adminController');
const adminAuth = require('../middlewares/adminAuth');

module.exports = require('express')()
    .post('/signin', adminController.signin)
    .get('/verify', adminAuth, adminController.verify)
    .post('/create-admin', adminAuth, adminController.createAdmin)
    .get('/get-admins', adminAuth, adminController.getAdmins)
    .put('/edit-admin/:id', adminAuth, adminController.editAdmin)
    .post('/hide-admin/:id', adminAuth, adminController.hideAdmin)