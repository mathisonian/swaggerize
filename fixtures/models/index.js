'use strict';
module.exports = function(cfg) {
    cfg.username = cfg.username || 'root';
    cfg.password = cfg.password || 'root';
    cfg.database = cfg.database || 'sequelize';
    cfg.db_cfg = cfg.db_config || {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306,
        // max concurrent database requests; default: 50
        maxConcurrentQueries: 100,
        pool: { // If you want to override the options used for the read pool you can do so here
            maxConnections: 20,
            maxIdleTime: 30000
        }
    };
    var Sequelize = require('sequelize'),
        fs = require('fs'),
        path = require('path'),
        db = new Sequelize(cfg.database, cfg.username, cfg.password, cfg.db_cfg),
        Swaggerize = require('../../index.js'),
        swaggerize = function(options) {
            return Swaggerize.generate(db, (options || {}));
        },
        sync = function(force) {
            return db.sync({force: force||false});
        },
        drop = function() {
            return db.drop();
        };
    db.models = {};
    fs
      .readdirSync(__dirname)
      .filter(function(file) {
          return (file.indexOf(".") !== 0) && (file !== "index.js");
      })
      .forEach(function(file) {
          var model = require(path.join(__dirname, file))(db, Sequelize);
          db.models[model.name] = model;
      });
    Object.keys(db.models).forEach(function(modelName) {
        if ("associate" in db.models[modelName]) {
            db.models[modelName].associate(db.models);
        }
    });

    return {
        db: db,
        // drop: drop, // Should we expose this to the world yet?
        swaggerize: swaggerize,
        sync: sync
    };
};
