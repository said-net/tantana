const adminModel = require('../models/adminModel');
const JWT = require('jsonwebtoken');
module.exports = (req, res, next) => {
    const token = req.headers['x-auth-token'];
    if (!token || !token.startsWith('X-Checker')) {
        res.send({
            ok: false,
            msg: "Avtorizatsiya qiling!"
        });
    } else {
        const signature = token.replace('X-Checker ', '');
        JWT.verify(signature, process.env.ACCESS, async (err, data) => {
            if (err) {
                res.send({
                    ok: false,
                    msg: "Qayta avtorizatsiya qiling!"
                });
            } else {
                const { adminId } = data;
                const $admin = await adminModel.findById(adminId);
                if (!$admin) {
                    res.send({
                        ok: false,
                        msg: "Avtorizatsiya qiling!"
                    });
                } else if ($admin.hidden) {
                    res.send({
                        ok: false,
                        msg: "Sizdan operatorlik huquqi olingan!"
                    });
                } else if ($admin.access !== signature) {
                    res.send({
                        ok: false,
                        msg: "Ushbu qurulmada sessiya yakunlangan! Qayta avtorizatsiya qiling!"
                    });
                } else {
                    const { full_name, phone, role } = $admin;
                    req.admin = { adminId, full_name, phone, role };
                    next();
                }
            }
        });
    }
}