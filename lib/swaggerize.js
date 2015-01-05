'use strict';

module.exports = function(_options) {
    var _ = require('lodash'),
        spec = require('./utils.js'),
        clean_type = function(type_string) {
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
        },
        defaults = {
            // control over generated swagger specification.
            auth_prefix: '/auth',
            add_auth_urls: true,
            list_crud: true,
            gen_yaml: false,
            // swagger boiler-plate configuration
            swagger: {
                info: {
                    'title': 'My applications awesome REST api',
                    'version': '1.0.0',
                    'description': 'the next REST api to rock the world',
                    'termsOfService': 'url',
                    'contact': {
                        'name': '',
                        'url': '',
                        'email': ''
                    },
                    'license': {
                        'name': 'ISC',
                        'url': ''
                    }
                },
                version: '1.0.0',
                host: 'api.example.com',
                basePath: '/v1',
                schemes: [ 'http', 'https', 'ws', 'wws'],
                consumes: [
                    'application/json'
                ],
                produces: [
                    'application/json'
                ]
            }
        },
        generate = function(sequelize, options) {
            // default reconciliation
            options = _.defaults((options||{}), [_options, defaults]);
            // error handling incase people pass in some wack object
            sequelize = sequelize || {};
            var dialect = sequelize.options.dialect,
            dfm = sequelize.daoFactoryManager || {},
            daos = dfm.daos || [];
            spec.generate_header(options.swagger);
            _.each(daos, function(dao) {
                var dao_obj = {
                    id: dao.name,
                    properties: {}
                },
                dao_props = dao_obj.properties;
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
                spec.generate_definition(dao.name, dao_obj);
                spec.generate_path(dao.name, dao.tableName);
            });
            return spec.get(options.gen_yaml);
        };
        return {
            generate: generate
        };
};
