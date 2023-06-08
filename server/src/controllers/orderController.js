const moment = require("moment");
const clientModel = require("../models/clientModel");
const orderModel = require("../models/orderModel");
const { default: axios } = require("axios");

module.exports = {
    create: async (req, res) => {
        const { name, location, about, date, phone, services, mortgage, status, note } = req.body;
        if (!name || !location || !phone) {
            res.send({
                ok: false,
                msg: "Mijoz ma'lumotlarini kiriting!"
            });
        } else {
            // status: pending, note, reject, success;
            // const $client = await clientModel.findOne({ phone });
            if (req.admin.role === 'operator' || req.admin.role === 'creator') {
                if (!status) {
                    res.send({
                        ok: false,
                        msg: "Status kiritng!"
                    })
                } else if (!about) {
                    res.send({
                        ok: false,
                        msg: "Qatorlarni to'ldiring!"
                    });
                } else if (status === 'note') {
                    const n = moment.now() / 1000 + Number(note);
                    new clientModel({
                        phone,
                        name, location,
                        from: req.admin.adminId,
                    }).save().then($saved => {
                        new orderModel({
                            client: $saved._id,
                            from: req.admin.adminId,
                            status,
                            note: n,
                            about,
                            createdAt: moment.now() / 1000
                        }).save().then(() => {
                            res.send({
                                ok: true,
                                msg: "Eslatma qo'sihldi!"
                            });
                        });
                    });
                } else if (status === 'reject') {
                    new clientModel({
                        phone,
                        name, location,
                        from: req.admin.adminId,
                    }).save().then($saved => {
                        new orderModel({
                            client: $saved._id,
                            from: req.admin.adminId,
                            status,
                            about,
                            createdAt: moment.now() / 1000
                        }).save().then(() => {
                            res.send({
                                ok: true,
                                msg: "Buyurtma bekor qilindi!"
                            });
                        });
                    });
                } else {
                    if (!date) {
                        res.send({
                            ok: false,
                            msg: "Sanani belgilang!"
                        });
                    } else {
                        const d = date?.split('-');
                        const ser = [];
                        services?.forEach(({ _id, price }) => {
                            ser?.push({ service: _id, price });
                        });
                        new clientModel({
                            phone,
                            name, location,
                            from: req.admin.adminId,
                        }).save().then($saved => {
                            new orderModel({
                                client: $saved._id,
                                from: req.admin.adminId,
                                status,
                                about,
                                day: +d[2],
                                month: +d[1] - 1,
                                year: +d[0],
                                mortgage,
                                services: ser,
                                createdAt: moment.now() / 1000
                            }).save().then(() => {
                                res.send({
                                    ok: true,
                                    msg: "Buyurtma qabul qilindi!"
                                });
                                const text = `<b>YANGI BUYURTMA</b>\n👤Buyurtmachi: ${$saved.name}\n📞Raqami: <code>${$saved.phone}</code>\n📅Qachonga: ${date}\n📋Batafsil: ${about}`
                                try {
                                    axios.post('https://api.telegram.org/bot5791198980:AAFKT1D2QlvNr2cz2712-IgecNQDy40NQek/sendMessage', {
                                        chat_id: "-1001970911176",
                                        text: text,
                                        parse_mode: "HTML"
                                    }).catch((err) => {
                                        console.log(err);
                                    });
                                } catch (err) {
                                    console.log(err);
                                }
                            });
                        });
                    }
                }
            }
        }
    },
    getAll: async (req, res) => {
        const { date, status } = req.query;
        if (req.admin.role === 'operator' || req.admin.role === 'creator') {
            const d = date?.split('-');
            const $orders = await (req.admin.role === 'operator' ? (status && date ? orderModel.find({ from: req.admin.adminId, status, day: d[2], month: d[1] - 1, year: d[0] }) : status && !date ? orderModel.find({ from: req.admin.adminId, status }) : !status && date ? orderModel.find({ from: req.admin.adminId, day: d[2], month: d[1] - 1, year: d[0] }) : orderModel.find({ from: req.admin.adminId }))
                :
                (status && date ? orderModel.find({ status, day: d[2], month: d[1] - 1, year: d[0] }) : status && !date ? orderModel.find({ status }) : !status && date ? orderModel.find({ day: d[2], month: d[1] - 1, year: d[0] }) : orderModel.find())
            ).populate({ path: 'services.service client from', select: 'title price name phone full_name location role' });
            const $modded = [];
            $orders.forEach(({ _id, client, about, mortgage, createdAt, type, status: st, year, day, month, services, note, from }) => {
                let prices = 0;
                let ser = [];
                services?.forEach(({ service, price }) => {
                    prices += price
                    ser.push({ title: service.title, _id: service._id, price });
                });
                if (st === 'note' && (note + 86400) > moment.now() / 1000) {
                    $modded.push({
                        _id,
                        from_name: from.full_name,
                        from_phone: from.phone,
                        role: from.role,
                        name: client.name,
                        phone: client.phone,
                        location: client.location,
                        about,
                        mortgage,
                        createdAt: moment.unix(createdAt).format('DD-MM-yyyy HH:mm'),
                        type,
                        toDate: moment.unix(note).format('DD-MM-yyyy'),
                        status: st,
                        date: `${day < 10 ? '0' : ''}${day}-${month + 1 < 10 ? '0' : ''}${month + 1}-${year}`,
                        inpDate: `${year}-${month + 1 < 10 ? '0' : ''}${month + 1}-${day < 10 ? '0' : ''}${day}`,
                        services: ser,
                        price: prices
                    })
                } else if (st !== 'note') {
                    $modded.push({
                        _id,
                        from_name: from.full_name,
                        from_phone: from.phone,
                        role: from.role,
                        name: client.name,
                        phone: client.phone,
                        location: client.location,
                        about,
                        mortgage,
                        createdAt: moment.unix(createdAt).format('DD-MM-yyyy HH:mm'),
                        toDate: moment.unix(note).format('DD-MM-yyyy'),
                        status: st,
                        date: `${day < 10 ? '0' : ''}${day}-${month + 1 < 10 ? '0' : ''}${month + 1}-${year}`,
                        inpDate: `${year}-${month + 1 < 10 ? '0' : ''}${month + 1}-${day < 10 ? '0' : ''}${day}`,
                        services: ser,
                        price: prices
                    });
                }
            });
            res.send({
                ok: true,
                msg: "Orders",
                data: $modded?.reverse()
            });
        }
    },
    getNotes: async (req, res) => {
        const { note, status } = req.params;
        const not = note;
        const $notes = await (req.admin.role === 'operator' ? orderModel.find({ status, from: req.admin.adminId }) : orderModel.find({ status })).populate('client services.service from', 'phone name location title full_name role');
        const unix = note === 'now' ? 86400 : note === 'tomorrow' ? 86400 * 2 : 86400 * 3;
        const $noteList = status === 'note' ? $notes.filter(n => n.note <= moment.now() / 1000 + unix) : $notes;
        const $modded = [];
        $noteList.forEach(($order) => {
            const { _id, client, about, mortgage, createdAt, type, status: st, year, day, month, services, note, from } = $order;
            const d = new Date();
            const filter = `${(d.getDate() + (not === 'now' ? 0 : not === 'tomorrow' ? 1 : 2)) < 10 ? '0' + (d.getDate() + (not === 'now' ? 0 : not === 'tomorrow' ? 1 : 2)) : (d.getDate() + (not === 'now' ? 0 : not === 'tomorrow' ? 1 : 2))}.${(d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : d.getMonth()}.${d.getFullYear()}`;
            let prices = 0;
            let ser = [];
            if (moment.unix(note).format('DD.MM.yyyy') === filter && status === 'note') {
                services?.forEach(({ service, price }) => {
                    prices += price
                    ser.push({ title: service.title, _id: service._id, price });
                });
                $modded.push({
                    _id,
                    name: client.name,
                    phone: client.phone,
                    location: client.location,
                    from_name: from.full_name,
                    from_phone: from.phone,
                    role: from.role,
                    about,
                    mortgage,
                    createdAt: moment.unix(createdAt).format('DD-MM-yyyy HH:mm'),
                    type,
                    toDate: moment.unix(note).format('DD-MM-yyyy HH:mm'),
                    status: st,
                    date: `${day < 10 ? '0' : ''}${day}-${month + 1 < 10 ? '0' : ''}${month + 1}-${year}`,
                    inpDate: `${year}-${month + 1 < 10 ? '0' : ''}${month + 1}-${day < 10 ? '0' : ''}${day}`,
                    services: ser,
                    price: prices
                });

            } else if (filter === `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + (month + 1) : (month + 1)}.${year}`) {
                services?.forEach(({ service, price }) => {
                    prices += price
                    ser.push({ title: service.title, _id: service._id, price });
                });
                $modded.push({
                    _id,
                    name: client.name,
                    phone: client.phone,
                    location: client.location,
                    from_name: from.full_name,
                    from_phone: from.phone,
                    role: from.role,
                    about,
                    mortgage,
                    createdAt: moment.unix(createdAt).format('DD-MM-yyyy HH:mm'),
                    type,
                    toDate: `${day < 10 ? '0' : ''}${day}-${month + 1 < 10 ? '0' : ''}${month + 1}-${year}`,
                    status: st,
                    date: `${day < 10 ? '0' : ''}${day}-${month + 1 < 10 ? '0' : ''}${month + 1}-${year}`,
                    inpDate: `${year}-${month + 1 < 10 ? '0' : ''}${month + 1}-${day < 10 ? '0' : ''}${day}`,
                    services: ser,
                    price: prices
                });
            }

        });
        res.send({
            ok: true,
            data: $modded?.reverse()
        });
    },
    setStatus: async (req, res) => {
        const { status } = req.body;
        const { id } = req.params;
        const $order = await orderModel.findById(id);
        if (!$order) {
            res.send({
                ok: false,
                msg: "Buyurtma topilmadi!"
            });
        } else if (status === 'success') {
            $order.set({ status: 'success' }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Buyurtma bajarildi deb belgilandi!"
                });
            });
        } else if (status === 'reject') {
            $order.set({ status: 'reject' }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Buyurtma bekorqilindi deb belgilandi!"
                });
            });
        }
    }
}