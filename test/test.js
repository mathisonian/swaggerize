'use strict';

describe('Swaggerize', function() {
    describe('Generate API', function() {
        it('should generate a Swagger API', function(done) {
            var db = require('../fixtures/models/index.js')({});
            var spec = db.swaggerize();
            console.log(spec);
            done();
        });
    });
});
