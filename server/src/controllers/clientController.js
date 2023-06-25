const adminModel = require("../models/adminModel");
const clientModel = require("../models/clientModel");
const orderModel = require("../models/orderModel");
const moment = require('moment');
module.exports = {
    create: (req, res) => {
        const { name, phone, location } = req.body;
        if (!name || !phone || !location) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            new clientModel({
                name, phone, location, from: req.admin.adminId, created: moment.now() / 1000
            }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Mijoz kiritldi!"
                });
            });
        }
    },
    getAll: async (req, res) => {
        const $clients = await (req.admin.role === 'creator' ? clientModel.find() : clientModel.find({ from: req.admin.adminId })).populate('from', 'full_name phone role created');
        const $modded = [];
        $clients.forEach((c) => {
            $modded.push({
                ...c._doc,
                created: !c?.created?"Eski baza":moment.unix(c.created).format("DD.MM.yyyy HH:mm")
            });
        })
        res.send({
            ok: true,
            data: $modded?.reverse()
        });
    },
    getFromPartners: async (req, res) => {
        try {
            const $clients = await clientModel.find().populate('from', 'full_name phone role created')
            const $partners = await adminModel.find({ role: 'partner' });
            const $modded = [];
            $clients.forEach(({ _id, name, from, phone, location, created }) => {
                if (from.role === 'partner') {
                    $modded.push({
                        _id,
                        name,
                        phone,
                        location,
                        from,
                        created: !created?"Eski baza":moment.unix(created).format("DD.MM.yyyy HH:mm")
                    });
                }
            });
            res.send({
                ok: true,
                data: $modded,
                partners: $partners
            });
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,

            })
        }
    },
    getAllOrders: async (req, res) => {
        const { id } = req.params;
        if (id === 'test') {
            res.send({
                ok: true,
                data: []
            });
        } else {
            const $orders = await orderModel.find({ client: id }).populate('from', 'name phone role');
            res.send({
                ok: true,
                data: $orders?.reverse()
            });
        }
    }
}