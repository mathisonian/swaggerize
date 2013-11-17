sequelize-swagger
===========

Generates Swagger model definitions from a sequelize object

usage
---

```js
var sequelize = require('sequelize');
var sequelize_swagger = require('sequelize-swagger');

var sequelize = new Sequelize(config.database, config.username, config.password, config.options);

// load your models here
//
// e.g. sequelize.import(UserModelFile)
//

sequelize.sync();

var swagger_model_json = sequelize_swagger(sequelize);
```


this will return a swagger-compliant json representation of your sequalize models. (it will look like [their example](https://github.com/wordnik/swagger-node-express/blob/master/Apps/petstore/models.js))


installation
--

Install with [npm](https://npmjs.org/package/sequelize-swagger)
`npm install sequelize-swagger`

notes
--

this is a new project, I would recommend using it to bootstrap your swagger files, but don't rely on it for complete automation right now.

license
-- 

The MIT License (MIT)

Copyright (c) 2013 Matthew Conlen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
