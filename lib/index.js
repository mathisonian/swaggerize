'use strict';

var _ = require('lodash');

var clean_type = function(type_string) {
    type_string = type_string.toLowerCase();

    var type_map = {
        'date': 'date',
        'datetime': 'date-time',
        'timestamp': 'date-time',
        'varchar': 'string'
    };

    _.each(type_map, function(val, key) {
        if(type_string.indexOf(key) > -1) {
            type_string = val;
        }
    });

    return type_string;
};

module.exports = function(sequelize, options) {

    // there are no options right now,
    // but it doesn't hurt to have the framework in place
    var defaults = {};
    options = options || {};
    options = _.defaults(options, defaults);

    // error handling incase people pass in some wack object
    sequelize = sequelize || {};
    var dfm = sequelize.daoFactoryManager || {};
    var daos = dfm.daos || [];

    var swagger_model_object = {};

    _.each(daos, function(dao) {
        
        var dao_obj = { id: dao.name, properties: {} };
        var dao_props = dao_obj.properties;

        _.each(dao.rawAttributes, function(val, key) {
            dao_props[key] = {};

            var type_string = '';
            if(_.isString(val.type)) {
                type_string  = val.type;
            } else if (_.isObject(val.type)) {
                type_string = val.type.toString();
            }

            type_string = clean_type(type_string);
            dao_props[key].type = type_string;
        });

        swagger_model_object[dao.name] = dao_obj;
    });

    return swagger_model_object;
};
