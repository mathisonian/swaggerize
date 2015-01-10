'use strict';

module.exports = function(_options) {
    var _ = require('lodash'),
        spec = require('./utils.js'),
        Sequelize = require('sequelize'),
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
            var dfm = sequelize.daoFactoryManager || {},
                daos = dfm.daos || [],
                swg = {
                    REQUIRED: 'REQUIRED',
                    HIDDEN: 'HIDDEN',
                    _VISIBLE: 'VISIBLE' // internal
                };
            spec.generate_header(options.swagger);
            _.each(daos, function(dao) {
                var dao_obj = {
                        //id: dao.name,
                        post: {
                            required: [],
                            properties: {}
                        },
                        get: {
                            required: [],
                            properties: {}
                        },
                        put: {
                            required: [],
                            properties: {}
                        },
                        delete: {
                            required: [],
                            properties: {}
                        }
                    },
                    type = function(format) {
                        var t = null;
                        switch(format) {
                            case 'int32': {
                                t = 'integer';
                                break;
                            }
                            case 'int64': {
                                t = 'integer';
                                break;
                            }
                            case 'float': {
                                t = 'number';
                                break;
                            }
                            case 'double': {
                                t = 'number';
                                break;
                            }
                            case 'byte': {
                                t = 'string';
                                break;
                            }
                            case 'date': {
                                t = 'string';
                                break;
                            }
                            case 'date-time': {
                                t = 'string';
                                break;
                            }
                        }
                        return t;
                    },
                    attrs = Object.keys(dao.rawAttributes).sort();
                _.each(attrs, function(key) {
                    var val = dao.rawAttributes[key],
                        format = clean_type(
                            (_.isString(val.type) && val.type) ||
                            (_.isObject(val.type) && val.type.toString())
                        ),
                        prop_visibility = {
                            post: swg._VISIBLE,
                            get: swg._VISIBLE,
                            put: swg._VISIBLE,
                            delete: swg._VISIBLE
                        },
                        spec = Object.keys(dao.attributes[key].swaggerize || {})
                                .reduce(function(acc,k, o) {
                                    acc[k.toLowerCase()] = o[k];
                                    return acc;
                                }, {});
                    spec = _.merge(prop_visibility, spec);
                    _.each(Object.keys(spec), function(op) {
                        switch(prop_visibility[op]) {
                            case swg.REQUIRED:
                                dao_obj[op].required.push(key);
                                dao_obj[op].properties[key] = {
                                    type: type(format),
                                    format: format
                                };
                                break;
                            case swg._VISIBLE:
                                dao_obj[op].properties[key] = {
                                    type: type(format),
                                    format: format
                                };
                                break;
                            default:
                                // it's hidden. no-op
                        }
                        if(null === dao_obj[op].properties[key].type) {
                            delete dao_obj[op].properties[key].type;
                        }
                        if (dao_obj[op].required &&
                            (0 === dao_obj[op].required.length)) {
                            delete dao_obj[op].required;
                        }
                    });
                });
                spec.generate_definition(dao.name, dao_obj);
                //spec.generate_parameters(dao.name, dao_obj);
                spec.generate_path(dao.name, dao.tableName);
            });
            return spec.get(options.gen_yaml);
        };
        return {
            generate: generate
        };
};
