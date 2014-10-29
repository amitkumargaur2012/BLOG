var mongodb = require('./db'),
    markdown = require('markdown').markdown;

function Post (name, title, post) {
    this.name = name;
    this.title = title;
    this.post = post;
}

module.exports = Post;

Post.prototype.save = function(callback) {
    var  date = new Date();

    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + '-' + (date.getMonth() + 1),
        day: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        minute: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
    };
    var post = {
        name: this.name,
        title: this.title,
        post: this.post,
        time: time
    };

    mongodb.open(function(error, db) {
        if(error) {
            return callback(error)
        }
        db.collection('posts', function(error, collection) {
            if(error) {
                mongodb.close()
                return callback(error);
            }
            collection.insert(post, {safe: true}, function(error, post) {
                mongodb.close();
                callback(null);
            });
        });
    });
};

Post.getAll = function(name, callback) {
    mongodb.open(function(error, db) {
        if(error) {
            return callback(error);
        }
        db.collection('posts', function(error, collection) {
            if(error) {
                mongodb.close();
                return callback(error);
            }
            var query = {};
            if(name) {
                query.name = name;
            }
            // througn query object find post
            collection.find(query).sort({time: -1}).toArray(function(error, docs) {
                mongodb.close();
                if(error) {
                    return callback(error);
                }
                docs.forEach(function(doc) {
                    doc.post = markdown.toHTML(doc.post);
                });
                callback(null, docs);
            });
        });
    });
};

Post.getOne = function(name, day, title, callback) {
    mongodb.open(function(error, db) {
        if(error) {
            return callback(error);
        }
        db.collection('posts', function(error, collection) {
            if(error) {
                mongodb.close();
                return callback(error);
            }
            collection.findOne({
                "name": name,
                "time.day": day,
                "title": title
            }, function(error, doc) {
                mongodb.close();
                if(error) {
                    return callback(error);
                }
                doc.post = markdown.toHTML(doc.post);
                console.log(doc.post);
                callback(null, doc);
            });
        });
    });
};