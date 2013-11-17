'use strict';

module.exports = function(sequelize, options) {
    return require('./lib')(sequelize, options);
};
