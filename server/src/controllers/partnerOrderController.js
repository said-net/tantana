const clientModel = require("../models/clientModel");
const partnerOrderModel = require("../models/partnerOrderModel");
const moment = require('moment')
module.exports = {
    create: async (req, res) => {
        const { about, mortgage, price, date, services, name, phone, location } = req.body;
        if (!name || !location || !phone) {
            res.send({
                ok: false,
                msg: "Mijoz ma'lumotlarini kiriting!"
            });
        } else if (!about || !mortgage || !price) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else if (!date) {
            res.send({
                ok: false,
                msg: "Sanani kiriting!"
            });
        } else if (!services) {
            res.send({
                ok: false,
                msg: "Servis hizmatlarini kiritng! yoki YO'Q deb yozing"
            });
        } else {
            new clientModel({
                from: req.admin.adminId,
                name, phone, location
            }).save().then($saved => {
                const d = date?.split('-');
                new partnerOrderModel({
                    from: req.admin.adminId,
                    client: $saved._id,
                    about,
                    mortgage,
                    price,
                    services,
                    day: +d[2],
                    month: +d[1] - 1,
                    year: +d[0],
                    createdAt: moment.now() / 1000
                }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Qo'shildi!"
                    });
                });
            });
        }
    },
    getAll: async (req, res) => {
        const $orders = await (req.admin.role === 'creator' || req.admin.role === 'operator' ? partnerOrderModel.find() : partnerOrderModel.find({ from: req.admin.adminId })).populate('from client', 'full_name name phone role location');
        const $modded = [];
        $orders.forEach(o => {
            $modded.push({
                ...o._doc,
                createdAt: moment.unix(o.createdAt).format("DD-MM-yyyy HH:mm")
            });
        })
        res.send({
            ok: true,
            data: $modded?.reverse()
        });
    }
}