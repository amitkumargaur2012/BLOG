/**
 * Created with JetBrains WebStorm.
 * User: zhu
 * Date: 13-10-19
 * Time: 下午1:29
 * To change this template use File | Settings | File Templates.
 */
var mongodb = require('./db');

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
}
 module.exports = User;
User.prototype.save = function(callback) {
    //model
    var user = {
        name: this.name,
        password: this.password,
        email: this.email
    };
    //open database
    mongodb.open(function(error, db) {
        if(error) {
            return callback(error);
        }
        db.collection('users', function(error, collection) {
            if(error) {
                mongodb.close();
                return callback(error);
            }
            //insert
            collection.insert(user, {safe: true}, function(error, user) {
                mongodb.close();
                callback(null, user[0]);
            });
        });
    });
};

//read user info
User.get = function(name, callback) {
    mongodb.open(function(error, db) {
        if(error) {
            return callback(error);
        }
        db.collection('users', function(error, collection) {
            if(error) {
                mongodb.close();
                return callback(error);
            }
            //find by name
            collection.findOne({name: name}, function(error, user) {
                mongodb.close();
                if(user) {
                    return callback(null, user);
                }
                callback(error);
            });
        });
    });
};
