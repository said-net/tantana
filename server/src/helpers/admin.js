const md5 = require("md5");
const adminModel = require("../models/adminModel")

module.exports = async()=>{
    const $admin = await adminModel.findOne({role: 'creator'});
    if(!$admin){
        new adminModel({
            full_name: "Saidislom",
            phone: "+998931042255",
            password: md5("555555"),
            role: 'creator'
        }).save();
    }
}