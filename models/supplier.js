'use strict;'
const mongoose = require("mongoose")

const supplierSchema = new mongoose.Schema({
    name: String,
    address: String
});

module.exports = supplierSchema;

