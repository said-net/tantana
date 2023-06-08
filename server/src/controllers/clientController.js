const clientModel = require("../models/clientModel");
const orderModel = require("../models/orderModel");

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
                name, phone, location, from: req.admin.adminId
            }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Mijoz kiritldi!"
                });
            });
        }
    },
    getAll: async (req, res) => {
        const $clients = await (req.admin.role === 'creator' ? clientModel.find() : clientModel.find({ from: req.admin.adminId })).populate('from', 'full_name phone role');
        res.send({
            ok: true,
            data: $clients?.reverse()
        });
    },
    getFromPartners: async (req, res) => {
        try {
            const $clients = await clientModel.find().populate('from', 'full_name phone role')
            const $modded = [];
            $clients.forEach(({ _id, name, from, phone, location }) => {
                if (from.role === 'partner') {
                    $modded.push({
                        _id,
                        name,
                        phone,
                        location,
                        from
                    });
                }
            });
            res.send({
                ok: true,
                data: $modded
            });
        } catch (error) {
            console.log(err);
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