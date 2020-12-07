const mongoose = require('mongoose');
const regionSchema = mongoose.Schema({
    company_id:String,
title:String
})
const Region = mongoose.model('Region',regionSchema);
module.exports = Region;