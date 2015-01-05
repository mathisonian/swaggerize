'use strict';

module.exports = function(options) {
    return require('./lib/swaggerize.js')(options || {});
}();
