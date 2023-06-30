const clientModel = require("../models/clientModel");
const Cities = require('../helpers/cities.json');
const Regions = require('../helpers/regions.json');
const moment = require('moment/moment');
const educationModel = require("../models/educationModel");
module.exports = {
    create: (req, res) => {
        const { type, region, city, education, class_room, teacher, phone, students, services, mortgage, date } = req.body;
        if (!type || !region || !city || !education || !class_room || !teacher || !phone || !students || !services[0] || !date) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            new clientModel({
                name: teacher,
                phone,
                from: req.admin.adminId,
                location: `${Regions.find(e => e.id === +region).name}, ${Cities.find(e => e.id === +city).name}`,
                created: moment.now() / 1000
            }).save().then($client => {
                const d = date?.split('-');
                const ser = [];
                services?.forEach(({ _id, price }) => {
                    ser?.push({ service: _id, price });
                });
                new educationModel({
                    client: $client._id,
                    from: req.admin.adminId,
                    type, region, city,
                    education, students, class_room,
                    services: ser,
                    day: +d[2],
                    month: +d[1] - 1,
                    year: +d[0],
                    mortgage,
                    created: moment.now() / 1000
                }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Saqlandi!"
                    });
                }).catch(() => {
                    res.send({
                        ok: false,
                        msg: "Qayta urunib ko'ring!"
                    });
                });
            });
        }
    },
    getAll: async (req, res) => {
        const { date, status } = req.query;
        if (req.admin.role === 'operator' || req.admin.role === 'creator') {
            const d = date?.split('-');
            const $orders = await (req.admin.role === 'operator' ? (status && date ? educationModel.find({ from: req.admin.adminId, status, day: d[2], month: d[1] - 1, year: d[0] }) : status && !date ? educationModel.find({ from: req.admin.adminId, status }) : !status && date ? educationModel.find({ from: req.admin.adminId, day: d[2], month: d[1] - 1, year: d[0] }) : educationModel.find({ from: req.admin.adminId }))
                :
                (status && date ? educationModel.find({ status, day: d[2], month: d[1] - 1, year: d[0] }) : status && !date ? educationModel.find({ status }) : !status && date ? educationModel.find({ day: d[2], month: d[1] - 1, year: d[0] }) : educationModel.find())
            ).populate({ path: 'services.service client from', select: 'title price name phone full_name location role' });
            const $modded = [];
            $orders.forEach(({ _id, client, mortgage, created, type, status: st, year, day, month, services, note, from, education, class_room, students, region, city, status }) => {
                let prices = 0;
                let ser = [];
                services?.forEach(({ service, price }) => {
                    prices += price
                    ser.push({ title: service.title, _id: service._id, price });
                });
                $modded.push({
                    _id,
                    from_name: from.full_name,
                    from_phone: from.phone,
                    role: from.role,
                    name: client.name,
                    phone: client.phone,
                    location: client.location,
                    type,
                    status,
                    region, city,
                    class_room,
                    students,
                    education,
                    mortgage,
                    createdAt: moment.unix(created).format('DD-MM-yyyy HH:mm'),
                    toDate: moment.unix(note).format('DD-MM-yyyy'),
                    status: st,
                    date: `${day < 10 ? '0' : ''}${day}-${month + 1 < 10 ? '0' : ''}${month + 1}-${year}`,
                    inpDate: `${year}-${month + 1 < 10 ? '0' : ''}${month + 1}-${day < 10 ? '0' : ''}${day}`,
                    services: ser,
                    price: prices
                });
            });
            res.send({
                ok: true,
                data: $modded?.reverse()
            })
        }
    },
    setStatus: async (req,res)=>{
        const {id, status} = req.params;
        const $order = await educationModel.findById(id);
        if(!$order){
            res.send({
                ok: false,
                msg: "Buyurtma topilmadi!"
            });
        }else{
            $order.set({status}).save().then(()=>{
                res.send({
                    ok: true,
                    msg: "O'zgarish saqlandi!"
                });
            }).catch(()=>{
                res.send({
                    ok: false,
                    msg: "Qayta urunib ko'ring!"
                });
            })
        }
    }
}