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
                location: `${Regions.find(e => e.id === +region)}, ${Cities.find(e => e.id === +city)}`,
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
    }
}