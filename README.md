Swaggerize
===========

Generates Swagger REST api from a sequelize object

Usage
---

```js
var Sequelize = require('sequelize'),
    Swaggerize = require('./index.js'),
    db = new Sequelize();
// With credentials, this would be
// var db = new Sequelize(
//           config.database,
//           config.username,
//           config.password,
//           config.options);

// Load your models here, or use the simple model below.
db.define("Task", {
    title: {
        type: Sequelize.STRING,
    }
});

var spec = Swaggerize.generate(db,{});
console.log(spec);
```

This will return a swagger-compliant REST api of your sequalize models, with support for CRUD operations over collections and items.
You can copy this into http://editor.swagger.io/#/edit to see the API in a more visual fashion.
Samples are generated and stored in samples/fixtures.yaml and samples/fixtures.json if you would like to try it out.

The REST API generator
---

Supposing your model is called ‘User’, with a primary key ID. Sequelize generates a table called ‘Users’.
Swaggerize will then generate the following API:

```
/Users
    POST: Create
    GET: Read
    PUT: Update
    DELETE: Delete

/User/{id}
    POST: Create
    GET: Read
    PUT: Update
    DELETE: Delete
```

Access Control
--

Sometimes, it is important to provide assymetric control over specific fields in a model.
For example, passwords should not be retrievable over the REST api.

Swaggerize provides for fine-grained control over each model field.
By default, each field is ‘VISIBLE’ across all REST interfaces for the model.
You can control this to be ‘REQUIRED’ or ‘HIDDEN’ in the Sequelize model definition.

Example below demonstrates such control over a User table with username/password:

```js
 User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            swaggerize: {
                POST: swg.REQUIRED,
                GET: swg.REQUIRED,
                PUT: swg.REQUIRED
            }
        },
        password: {
            type: DataTypes.STRING,
            swaggerize: {
                POST: swg.REQUIRED,
                GET: swg.HIDDEN
            }
        });
```


Installation
--

Install with [npm](https://npmjs.org/package/sequelize-swagger)

`npm install swaggerize`

Options
--

Swaggerize provides for some configurability. Options described in self-documenting json.
```js
{
    // generate spec in yaml instead of json.
    gen_yaml: false,
    // swagger boiler-plate configuration
    swagger: {
        info: {
            'title': 'My applications awesome REST api',
            'version': '1.0.0',
            'description': 'the next REST api to rock the world',
            'termsOfService': '',
            'contact': {
                'name': '',
                'url': 'https://www.example.com',
                'email': 'contact@example.com'
            },
            'license': {
                'name': 'ISC',
                'url': 'https://www.example.com/license'
            }
        },
        version: '1.0.0',
        host: 'api.example.com',
        basePath: '/v1',
        schemes: [ 'http', 'https', 'ws', 'wss'],
        consumes: [
            'application/json'
        ],
        produces: [
            'application/json'
        ]
    }
}
```

TODO
--
1. Support for security over the API is not available at this point.
2. Need to add support for custom paths.

Notes
--

this is a new project, I would recommend using it to bootstrap your swagger files, but don't rely on it for complete automation right now.

license
-- 

The MIT License (MIT)

Copyright (c) 2013 Matthew Conlen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
