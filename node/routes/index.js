try {
  var config = require('../config');
} catch (e) {}

var mongo = require('mongodb').MongoClient;

// Get URL from Environment or Local config
var url = process.env.MONGOHQ_URL || config.MONGOHQ_URL;

function Msg(){}

Msg.prototype.check = function()
{

  // Return if it's not an email adress
  if (-1 == this.message.search(/hejsan/)) {
    return false;
  }

  return true;

};

function StorageRepository(){}

StorageRepository.prototype.persist = function(entity, callback)
{

  if(!url){
    return callback({'error':true});
  }

  mongo.connect(url, function (err, db) {

    if (!err) {
      db.collection('msg').save({'from': entity.from, 'to': entity.to, 'message': entity.message, 'date': entity.date}, function(er,rs) {
          return callback(er);
      });
    } else{
        return callback(err);
    }
  });  
}



StorageRepository.prototype.find = function(id, callback)
{
  mongo.connect(url, function (err, db) {
    db.collection('msg', function(er, collection) {
      collection.find({to:id}, function(er, item) {
        callback(item);
      });
    });
  });
}




// API

exports.index = function(req, res){
  res.send('You are probably looking for <a href="http://haikyou.github.io">haikyou.github.io</a>');
};




exports.send = function(req, res){
  var msg = new Msg();

  msg.date = new Date();
  msg.from = 'bebop';
  msg.to = 'rocksteady';
  msg.message = req.params.haiku;
  msg.visibility = 'public';


  // res.json(422, {'message': 'That is not an haiku'});

  var storage = new StorageRepository();

  storage.persist(msg, function(err){
    if (!err) {
      res.json({'message':'success'});    
    } else{
      res.send(400);    
    }
  });
};




exports.getAll = function(req, res){
  var storage = new StorageRepository();

  storage.find('rocksteady', function(entity){
    res.json(entity);
  });  
};