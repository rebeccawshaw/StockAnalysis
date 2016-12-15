'use strict';

let mongoose = require('mongoose');

let stockSchema = new mongoose.Schema({
    date: Date,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
    adjClose: Number,
    symbol: String
});

stockSchema.pre('save', function(next) {
    next();
});

module.exports = mongoose.model('Stock', stockSchema);