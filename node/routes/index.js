try {
  var config = require('../config');
} catch (e) {}

var mongo = require('mongodb').MongoClient;

// Get URL from Environment or Local config
var url = process.env.MONGOHQ_URL || config.MONGOHQ_URL;

function Msg(){}

Msg.prototype.isHaiku = function()
{

  // Return if not an haiku
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
      db.collection('msg').save({'from': entity.from, 'to': entity.to, 'message': entity.message, 'date': entity.date, 'visibility': entity.visibility}, function(er,rs) {
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
      collection.find({
        "to":id
      }, {
        "_id":false
      }).limit(4).sort({'date':-1}).toArray(function(err, res){
        if(!err){
          callback(res);
        }
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
  msg.from = req.body.from;
  msg.to = req.body.to;
  msg.message = req.body.message;
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







exports.conversation = function(req, res){
  var storage = new StorageRepository();

  storage.find('Rocksteady', function(entity){
    res.json(entity);
  });  
};
