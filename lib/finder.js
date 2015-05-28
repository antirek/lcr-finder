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
                var result = createResultObject(search(number, doc));
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
            if (directions.length > 0) {
                result.push({
                    name: provider.name, 
                    template: directions[0].template,
                    price: directions[0].price
                });
            };       
        });

        log('finded:', result);
        return result;
    };

    var createResultObject = function (array) {

        var sortBy = function(arrayObjects, key) {
          return arrayObjects.slice(0).sort(function (a,b) {
            return (a[key] > b[key]) ? 1 : (a[key] < b[key]) ? -1 : 0;
          });
        };

        var result = {
            sequence: null,
            provider: null
        };

        if (array.length && array.length > 0) {
            var sortedArray = sortBy(array, 'price');
            var q = sortedArray.map(function (item) {            
                return item.name;
            });
            
            result.sequence = q.join(',');
            result.provider = sortedArray[0].name
        }

        return result;
    };
};
module.exports = Finder;