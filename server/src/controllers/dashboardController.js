const educationModel = require("../models/educationModel");
const orderModel = require("../models/orderModel");
const partnerOrderModel = require("../models/partnerOrderModel");

module.exports = {
    getDashboard: async (req, res) => {
        if (req.admin.role === 'partner') {
            function getDaysInMonth(year, month) {
                return `${new Date(year, month, 0).getDate()}`;
            }
            const date = new Date();
            const currentYear = date.getFullYear();
            const currentMonth = date.getMonth() + 1;
            let days = [];
            let $orders = await partnerOrderModel.find({ from: req.admin.adminId, year: currentYear, month: currentMonth - 1 }).populate('from client', 'name full_name phone order location');
            for (let i = 1; i <= getDaysInMonth(currentYear, currentMonth); i++) {
                days.push(i);
            }
            res.send({
                ok: true,
                calendar: days,
                pending: $orders
            });
        } else {
            const { date } = req.query;
            const d = !date ? { month: new Date().getMonth(), year: new Date().getFullYear() } : { month: date.split('-')[1] - 1, year: date.split('-')[0] };
            const $orders = await (req.admin.role === 'operator' ? orderModel.find({ month: d.month, year: d.year, from: req.admin.adminId }) : orderModel.find({ month: d.month, year: d.year }));

            const $educations = await (req.admin.role === 'operator' ? educationModel.find({ month: d.month, year: d.year, from: req.admin.adminId }) : educationModel.find({ month: d.month, year: d.year }));
            let data = {
                success: 0,
                reject: 0,
                pending: 0,
                payed: 0,
                comming_pay: 0
            };
            $orders.forEach((o) => {
                if (o.status === 'success') {
                    data.success += 1;
                    o.services.forEach(({ price }) => {
                        data.payed += Math.floor(price);
                    });
                } else if (o.status === 'reject') {
                    data.reject += 1;
                } else if (o.status === 'pending') {
                    data.pending += 1;
                    data.payed += Math.floor(o.mortgage);
                    o.services.forEach(({ price }) => {
                        data.comming_pay += Math.floor(price); 
                    });
                    data.comming_pay -= Math.floor(o.mortgage);
                }
            });

            $educations.forEach((o) => {
                if (o.status === 'success') {
                    data.success += 1;
                    o.services.forEach(({ price }) => {
                        data.payed += Math.floor(price);
                    });
                } else if (o.status === 'rejected') {
                    data.reject += 1;
                } else if (o.status === 'pending') {
                    data.pending += 1;
                    data.payed += Math.floor(o.mortgage);
                    o.services.forEach(({ price }) => {
                        data.comming_pay += Math.floor(price); 
                    });
                    data.comming_pay -= Math.floor(o.mortgage);
                }
            });
            res.send({
                ok: true,
                data: {
                    ...data, profit: Math.floor(data.payed * 0.05), comming_profit: Math.floor(data.comming_pay * 0.05)
                }
            });
        }
    }
}