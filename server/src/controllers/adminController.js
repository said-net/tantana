const md5 = require("md5");
const adminModel = require("../models/adminModel");
const phoneCheck = require('phone');
module.exports = {
    signin: async (req, res) => {
        const { phone, password, check } = req.body;
        if (!phone || !password) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            const $admin = await adminModel.findOne({ phone });
            if (!$admin) {
                res.send({
                    ok: false,
                    msg: "Ushbu raqam avval ro'yhatdan o'tmagan!"
                });
            } else if ($admin.password !== md5(password)) {
                res.send({
                    ok: false,
                    msg: "Parol hato kiritildi!"
                });
            } else if ($admin.hidden) {
                res.send({
                    ok: false,
                    msg: "Sizdan operatorlik huquqi olingan!"
                })
            } else {
                const token = require("jsonwebtoken").sign({ adminId: $admin._id }, process.env.ACCESS, { expiresIn: !check ? '1h' : '30d' });
                $admin.set({ access: token }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Profilga yo'naltirildi!",
                        token
                    });
                }).catch(err => {
                    console.log(err);
                    res.send({
                        ok: false,
                        msg: "Fatal error SIGNIN SERVER"
                    });
                });
            }
        }
    },
    verify: (req, res) => {
        res.send({
            ok: true,
            msg: "Profile",
            data: req.admin
        });
    },
    createAdmin: async (req, res) => {
        const { full_name, phone, password, role } = req.body;
        if (req.admin.role !== 'creator') {
            res.send({
                ok: false,
                msg: "Sizda admin qo'shish uchun huquq yo'q"
            });
        } else if (!full_name || !phone || !password || !role) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else if (!phoneCheck.phone(phone).isValid) {
            res.send({
                ok: false,
                msg: "Admin raqamini to'g'ri kiriting!"
            });
        } else if (password.length < 6) {
            res.send({
                ok: false,
                msg: "Parol kamida 6 ta ishoradan iborat bo'ladi!"
            });
        } else {
            new adminModel({
                full_name,
                phone,
                role,
                password: md5(password)
            }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Saqlandi!",
                    data: {
                        full_name,
                        phone,
                        password,
                        role
                    }
                });
            });
        }
    },
    getAdmins: async (req, res) => {
        if (req.admin.role !== 'creator') {
            res.send({
                ok: false,
                msg: "Sizda huquq mavjud emas"
            });
        } else {
            const $admins = await adminModel.find({ role: 'operator', hidden: false });
            const $partners = await adminModel.find({ role: 'partner', hidden: false });
            res.send({
                ok: true,
                data: [...$admins, ...$partners]
            });
        }
    },
    editAdmin: async (req, res) => {
        const { id } = req.params;
        if (req.admin.role !== 'creator') {
            res.send({
                ok: false,
                msg: "Sizda huquq mavjud emas!"
            })
        } else {
            try {
                const $user = await adminModel.findById(id);
                if (!$user) {
                    res.send({
                        ok: false,
                        msg: "Admin topilmadi!"
                    });
                } else {
                    if (req.body?.password) {
                        $user.set({ ...req.body, password: md5(req.body.password) }).save().then(() => {
                            res.send({
                                ok: true,
                                msg: "O'zgartirildi!"
                            });
                        }).catch(err => {
                            console.log(err);
                            res.send({
                                ok: false,
                                msg: "Ushbu raqam avval ishlatilgan!"
                            })
                        })
                    } else {
                        $user.set(req.body).save().then(() => {
                            res.send({
                                ok: true,
                                msg: "O'zgartirildi!"
                            });
                        }).catch(err => {
                            console.log(err);
                            res.send({
                                ok: false,
                                msg: "Ushbu raqam avval ishlatilgan!"
                            })
                        })
                    }
                }
            } catch (error) {
                console.log(error);
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                })
            }
        }
    },
    hideAdmin: async (req, res) => {
        const { id } = req.params;
        try {
            const $user = await adminModel.findById(id);
            if (!$user) {
                res.send({
                    ok: false,
                    msg: "Admin topilmadi!"
                });
            } else {
                $user.set({ hidden: true }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "O'chirildi!"
                    });
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    }
}