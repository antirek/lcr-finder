'use strict';

var Q = require('q');

function Finder(dbModel) {

    var log;

    this.setLogFunction = function (logFunction) {
        log = logFunction;
    };

    this.findCodeForNumber = function (number) {
        var defer = Q.defer();

        dbModel.find({}, function (err, doc) {
            if (err) {
                defer.reject(err);
            } else {                
                
                //console.log(doc);
                var result = search(number, doc);
                defer.resolve(result);
            }
        });        

        return defer.promise;
    };

    var getSliceArray = function (number) {
        var ar = [];
        ar[0] = number;
        var length = number.split('').length;
        for (var i = 1; i < length; i++){
            ar[i] = number.slice(0, -i);
        };
        //console.log(ar);
        return ar;
    }

    var search = function (number, providers) {
        var sliceArray = getSliceArray(number);
        var result = [];
        providers.map(function (provider) {
            var directions = [];
            var w = sliceArray.map(function (query) {
                provider.directions.map(function (direction) {
                    if (direction.template == query) {
                        directions.push(direction);
                    }
                });
            });
            //console.log('provider', directions);
            if (directions.length > 0) {
                result.push({
                    name: provider.name, 
                    template: directions[0].template,
                    price: directions[0].price
                });
            };       
        });
        //console.log('my', result);
        return result;
    };
};
module.exports = Finder;