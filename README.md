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

