'use strict';

module.exports = function() {

    var _ = require('lodash'),
        //nunjucks = require('nunjucks'),
        YAML = require('yamljs'),
        fs = require('fs'),
        swagger_20_schema =  function() {
            var data = fs.readFileSync(__dirname + '/../node_modules/swagger-schema-official/schema.json');
            return data;
        }(),
        validator = require('JSV').JSV.createEnvironment(),
        swagger_tmpl = {
            swagger: '2.0',
            info: {
                title: 'My awesome REST API',
                version: '1.0.0',
                description: 'We will rocking the RESTful world',
                termsOfService: '',
                contact: {
                    name: 'Contact',
                    url: 'http://www.example.com',
                    email: 'contact@example.com'
                },
                license: {
                    name: 'ISC',
                    url: 'http://www.example.com/license'
                }
            },
            host: 'api.example.com',
            basePath: '/v1',
            schemes: [
                'http',
                'https',
                'ws',
                'wss'
            ],
            consumes: [
                'application/json'
            ],
            produces: [
                'application/json'
            ],
            paths: {},
            definitions: {
                /*error: {
                    properties: {
                        error: {
                            type: 'string',
                            required: 'true'
                        }
                    }
                }*/
            },
            //parameters: {},
            //responses: {},
            //securityDefinitions: {},
            //security: {},
            tags: [{name: 'API'}],
            //externalDocs: {}
        },
        /*
        definition_tmpl = {

        },
        parameter_tmpl = {

        },
        header_tmpl = {
            description: ''
        },
        response_tmpl = {
            description: '',
            schema: ''
        },
        */
        spec = _.merge({}, swagger_tmpl),
        validate = function() {
            var result = validator.validate(JSON.stringify(spec), swagger_20_schema);
            if (result.errors.length === 0) {
                return true;
            } else {
                // we'll need to log the errors.
                console.error('Schema validation failure: ');
                console.error(JSON.stringify(result.errors, null, 2));
                return false;
            }
        },
        generate_header = function(cfg) {
            spec = _.merge(spec, cfg);
        },
        generate_definition = function(name, model) {
            for(var op in model) {
                spec.definitions[name+'_'+op] = model[op];
            }
            //spec.definitions[name] = _.merge({}, definition_tmpl, model);
        },
        generate_path = function(model_name, plural_name, primary_key_name) {
            var ops = [{
                    method: 'get',
                    desc: 'Read',
                    produces: ['application/json']
                }, {
                    method: 'post',
                    desc: 'Create',
                    consumes: ['application/json']
                }, {
                    method: 'put',
                    desc: 'Update',
                    consumes: ['application/json']
                }, {
                    method: 'delete',
                    desc: 'Delete',
                    consumes: ['application/json']
                }],
                path = {
                    collection : '/' + plural_name,
                    item: '/' + model_name + '/{' + primary_key_name + '}'
                },
                paths = {};
            // initialize the containers
            paths[path.collection] = {};
            paths[path.item] = {};
            // first the collection paths
            ops.forEach(function(op) {
                var is_list = false;
                op.method = op.method.toLowerCase();
                paths[path.collection][op.method] = {
                    tags : [model_name, plural_name],
                    summary: op.desc + ' a list of ' + plural_name,
                    operationId: model_name + 'List' + op.desc,
                    consumes: op.consumes,
                    produces: op.produces,
                    parameters: [generate_parameter(model_name, op.method, is_list=true)],
                    responses: generate_response(model_name, op.method === 'get', is_list=true)
                };
                if (op.method === 'get') {
                    delete paths[path.collection][op.method].consumes;
                    delete paths[path.collection][op.method].parameters;
                } else {
                    delete paths[path.collection][op.method].produces;
                }
                paths[path.item][op.method] = {
                    tags : [model_name, plural_name],
                    summary: op.desc + ' a ' + model_name,
                    operationId: model_name + op.desc,
                    consumes: op.consumes,
                    produces: op.produces,
                    parameters: [generate_parameter(model_name, op.method, is_list=false)],
                    responses: generate_response(model_name, op.method === 'get', is_list=false)
                };
                if (op.method === 'get') {
                    delete paths[path.item][op.method].consumes;
                    //delete paths[path.item][op.method].parameters;
                } else {
                    delete paths[path.item][op.method].produces;
                    paths[path.item][op.method].parameters.push({
                        in: 'path',
                        name: 'id',
                        type: 'string'
                    });
                }
            });
            spec.paths = _.merge(spec.paths, paths);
            //spec.paths[path] = spec.paths[path] ||{};
            //spec.paths[path][method] = _.merge({}, operation_tmpl, model);
        },
        generate_parameter = function(name, op, is_list) {
            if (op === 'get') {
                return {
                    in: 'path',
                    name: 'id',
                    type: 'string'
                };
            } else if(is_list) {
                return {
                    in: 'body',
                    required: true,
                    name: name+'_List_' + op,
                    schema: {
                        type: 'array',
                        items: {
                            '$ref' : '#/definitions/' + name + '_' + op
                        }
                    }
                };
            } else {
                return {
                    in: 'body',
                    required: true,
                    name: name + '_' + op,
                    schema: {
                        '$ref': '#/definitions/' + name + '_' + op
                    }
                };
            }
        },
        generate_response = function(name, is_get, is_list) {
            var resp_tmpl = {
                    '200': {
                        description: 'Successful operation',
                        headers: {},
                        schema: {} // filled in momentarily
                    },
                    '405': {
                        description: 'Validation exception',
                        schema: {
                            properties: {
                                error: {
                                    type: 'string',
                                    //required: 'true',
                                    default: 'Error validating request for ' + name
                                }
                            }
                        }
                    },
                    '404': {
                        description: name + ' not found',
                        schema: {
                            properties: {
                                error: {
                                    type: 'string',
                                    //required: 'true',
                                    default:  name  + ' not found'
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized access.',
                        schema: {
                            properties: {
                                error: {
                                    type: 'string',
                                    //required: 'true',
                                    default: 'Unauthorized attempt to access ' + name
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Invalid ID supplied',
                        schema: {
                            properties: {
                                error: {
                                    type: 'string',
                                    //required: 'true',
                                    default:  'Invalid ' + name + ' ID supplied'
                                }
                            }
                        }
                    }
            };
            if (!is_get) {
                // response to a post/put/delete
                resp_tmpl['200'].schema = {
                    title: name,
                };
            } else if(!is_list) {
                // response to an item get
                resp_tmpl['200'].schema = {
                    title: name,
                    '$ref' : '#/definitions/' + name + '_get'
                };
            } else {
                // response to an collection get
                resp_tmpl['200'].schema = {
                    title: name,
                    type: 'array',
                    items: {
                        '$ref' : '#/definitions/' + name + '_get'
                    }
                };
            }
            return resp_tmpl;
        };

        return {
            generate_header: generate_header,
            generate_path: generate_path,
            generate_definition: generate_definition,
            generate_parameter: generate_parameter,
            generate_response: generate_response,
            get: function(yaml) {
                yaml = yaml || false;
                if (validate()) {
                    return (yaml ? YAML.dump(spec,100,2): JSON.stringify(spec, null, 2));
                } else {
                    console.error('Errors found when validating generated Swagger');
                    return false;
                }
            }
        };
}();

