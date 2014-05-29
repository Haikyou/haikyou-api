try {
  var config = require('../config');
} catch (e) {}

var mongo = require('mongodb').MongoClient;

// Get URL from Environment or Local config
var url = process.env.MONGOHQ_URL || config.MONGOHQ_URL;

function Msg(){}
function MsgRepository(){}

MsgRepository.prototype.persist = function(entity, callback){

  if(!url){
    return callback({'error':true});
  }

  mongo.connect(url, function (err, db) {

    if (!err) {
      db.collection('email').save({'_id': entity.email, 'date': entity.date}, function(er,rs) {
          return callback(er);
      });
    } else{
        return callback(err);
    }
  });  
}




// API

exports.index = function(req, res){
  res.send('You are probably looking for <a href="http://haikyou.github.io">haikyou.github.io</a>');
};




exports.send = function(req, res){
  var msg = new Msg();
  msg.date = new Date();
  msg.email = req.params.email;

  // Return if it's not an email adress
  if (-1 == entity.email.search(/.+@.+/)) {
    res.json(422, {'message':'Bad email address'});
  }

  var repo = new StorageRepository();

  repo.persist(entity, function(err){
    if (!err) {
      res.json({'message':'success'});    
    } else{
      res.send(400);    
    }
  });
};




exports.getAll = function(req, res){
};