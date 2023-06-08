const serviceModel = require("../models/serviceModel");

module.exports = {
    create: (req, res) => {
        const { title, about } = req.body;
        if (req.admin.role !== 'creator') {
            res.send({
                ok: false,
                msg: "Sizda huquq mavjud emas!"
            });
        } else if (!title) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            new serviceModel({
                title,
                about: about ? about : "Ma'lumot yo'q",
            }).save().then(() => {
                res.send({
                    ok: true,
                    msg: title + " hizmati qo'shildi!"
                });
            }).catch(err => {
                console.log(err);
                res.send({
                    ok: false,
                    msg: "Ushbu hizmat avval kiritilgan!"
                });
            });
        }
    },
    getAll: async (req, res) => {
        const $Services = await serviceModel.find({hidden: false});
        if (!$Services[0]) {
            res.send({
                ok: false,
                msg: "Hizmatlar mavjud emas!"
            });
        } else {
            res.send({
                ok: true,
                msg: "Barcha hizmatlar",
                data: $Services
            });
        }
    },
    editService: async (req, res) => {
        const { id } = req.params
        if (req.admin.role !== 'creator') {
            res.send({
                ok: false,
                msg: "Siz o'zgartirishingiz uchun huquq yo'q"
            })
        } else {
            try {
                const $serive = await serviceModel.findById(id)
                if (!$serive) {
                    res.send({
                        ok: false,
                        msg: "Bu hizmat mavjud emas!"
                    })
                } else {
                    $serive.set(req.body).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "O'zgartirildi!"
                        })
                    }).catch(err => {
                        console.log(err);
                        res.send({
                            ok: false,
                            msg: "O'zgartirilmadi"
                        })
                    })
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
    hideService: async (req, res) => {
        const { id } = req.params
        if (req.admin.role !== 'creator') {
            res.send({
                ok: false,
                msg: "Siz hizmatni o'chirish uchun huquqingiz yo'q"
            })
        } else {
            try {
                const $service = await serviceModel.findById(id);
                if ($service) {
                    res.send({
                        ok: false,
                        msg: "Bu hizmat mavjud emas!"
                    })
                } else {
                    $service.set({ hidden: true }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "O'chirildi!"
                        })
                    }).catch(err => {
                        console.log(err);
                        res.send({
                            ok: false,
                            msg: "O'chirilmadi!"
                        })
                    })
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
}