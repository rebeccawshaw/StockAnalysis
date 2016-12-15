'use strict';

var express = require('express');
var bodyParser      = require('body-parser');
var _ = require('underscore');
var Stock = require('./models/stockSchema');
var mongoose = require('mongoose');
var yahooFinance = require('yahoo-finance');
var googleFinance = require('google-finance');

let app = express();
app.use(express.static('public'));
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:33701/shawr1');

app.post('/v1/stocks', function(req, res){
    Stock.remove({}, function(err) {
        if (err) throw err;
    });

    if (req.body.source == 'yahoo') {
        yahooFinance.historical({
            symbol: req.body.symbol.toUpperCase(),
            from: req.body.from_date,
            to: req.body.to_date,
            period: 'd'
        }, function (err, quotes) {
            if (err) throw err;

            Stock.insertMany(quotes, function (err, r) {
                if (err) throw err;

                var o = {};
                o.map = function () {
                    var value = {
                        open: this.open,
                        high: this.high,
                        low: this.low,
                        close: this.close,
                        volume: this.volume,
                        adjClose: this.adjClose
                    };
                    emit({symbol: this.symbol, year: this.date.getFullYear(), month: this.date.getMonth()}, value);
                };
                o.reduce = function (k, vals) {
                    var data = {
                        count: 0,
                        open: 0,
                        high: 0,
                        low: 0,
                        close: 0,
                        volume: 0,
                        adjClose: 0
                    };

                    for (var i = 0; i < vals.length; i++) {
                        data.count++;
                        data.open += vals[i].open;
                        data.high += vals[i].high;
                        data.low += vals[i].low;
                        data.close += vals[i].close;
                        data.volume += vals[i].volume;
                        data.adjClose += vals[i].adjClose;
                    }

                    return data;
                };
                o.query = {
                    symbol: req.body.symbol.toUpperCase()
                };
                o.finalize = function (k, data) {
                    var results = {};
                    results.open_avg = data.open / data.count;
                    results.high_avg = data.high / data.count;
                    results.low_avg = data.low / data.count;
                    results.close_avg = data.close / data.count;
                    results.volume_avg = data.volume / data.count;
                    results.adjClose_avg = data.adjClose / data.count;

                    return results;
                };

                Stock.mapReduce(o, function (err, results) {
                    if (err) throw err;

                    res.send(results);
                })
            });
        });
    } else if (req.body.source == 'google') {
        googleFinance.historical({
            symbol: "NASDAQ:" + req.body.symbol.toUpperCase(),
            from: req.body.from_date,
            to: req.body.to_date,
        }, function (err, quotes) {
            if (err) throw err;

            Stock.insertMany(quotes, function (err, r) {
                if (err) throw err;

                var o = {};
                o.map = function () {
                    var value = {
                        open: this.open,
                        high: this.high,
                        low: this.low,
                        close: this.close,
                        volume: this.volume,
                        adjClose: this.adjClose
                    };
                    emit({symbol: this.symbol, year: this.date.getFullYear(), month: this.date.getMonth()}, value);
                };
                o.reduce = function (k, vals) {
                    var data = {
                        count: 0,
                        open: 0,
                        high: 0,
                        low: 0,
                        close: 0,
                        volume: 0,
                        adjClose: 0
                    };

                    for (var i = 0; i < vals.length; i++) {
                        data.count++;
                        data.open += vals[i].open;
                        data.high += vals[i].high;
                        data.low += vals[i].low;
                        data.close += vals[i].close;
                        data.volume += vals[i].volume;
                        data.adjClose += vals[i].adjClose;
                    }

                    return data;
                };
                o.query = {
                    symbol: "NASDAQ:" + req.body.symbol.toUpperCase()
                };
                o.finalize = function (k, data) {
                    var results = {};
                    results.open_avg = data.open/data.count;
                    results.high_avg = data.high/data.count;
                    results.low_avg = data.low/data.count;
                    results.close_avg = data.close/data.count;
                    results.volume_avg = data.volume/data.count;
                    results.adjClose_avg = data.adjClose/data.count;

                    return results;
                };

                Stock.mapReduce(o, function (err, results) {
                    if (err) throw err;

                    res.send(results);
                })
            });
        });
    }
});


let server = app.listen(8080, function () {
    console.log('Example app listening on ' + server.address().port);
});