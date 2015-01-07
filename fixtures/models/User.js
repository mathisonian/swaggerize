'use strict';

module.exports = function(sequelize, DataTypes) {

  var swg = {
      REQUIRED: 'REQUIRED',
      HIDDEN: 'HIDDEN'
    },
    User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            swaggerize: {
                param: swg.REQUIRED,
                response: swg.REQUIRED
            }
        },
        password: {
            type: DataTypes.STRING,
            swaggerize: {
                param: swg.HIDDEN,
                response: swg.OPTIONAL
            }
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            swaggerize: {
                param: swg.REQUIRED,
                response: swg.REQUIRED
            }
        },
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            autoIncrement: true,
            primaryKey: true,
            swaggerize: {
                response: swg.REQUIRED
            }
        },
        profile: {
            type: DataTypes.STRING,
            unique: true,
        },
        salt: {
            type: DataTypes.STRING,
            swaggerize: {
                param: swg.HIDDEN,
                response: swg.HIDDEN
            }
        },
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Task);
      }
    },
    instanceMethods: {
        swagger : {
            fromParams: function(params, validate) {
                if(validate) {
                    if (params.id === this.id) {
                        this.username = params.username || this.username;
                        this.email = params.email || this.email;
                        this.profile = params.profile || this.profile;
                        if (params.password && params.password) {
                        }
                        // read only parameters:
                        return true;
                    }
                }
                return false;
            },
            toResponse: function() {
                return {
                    username: this.username,
                    email: this.email,
                    id: this.id,
                    profile: this.profile
                };
            }
        }
    }
  });

  return User;
};
