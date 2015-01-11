
'use strict';
var db = require('./fixtures/models/index.js')({});
var spec = db.swaggerize({gen_yaml:false});
console.log(spec);
