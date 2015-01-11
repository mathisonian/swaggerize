'use strict';

var expect = require('expect.js');


describe('Swaggerize', function() {
    describe('Generate API', function() {
        it('should generate a Swagger API', function(done) {
            var db = require('../fixtures/models/index.js')({});
            var spec = db.swaggerize();

            var expected = require('../sample/fixture.json');

            spec = JSON.parse(spec);

            expect(spec).to.eql(expected);
            done();
        });
    });
});
