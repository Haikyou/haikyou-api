try {
  var config = require('../config');
} catch (e) {}

var mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

// Get URL from Environment or Local config
var url = process.env.MONGOHQ_URL || config.MONGOHQ_URL;

function Msg(){
  this.date = new Date();
}

Msg.prototype.isHaiku = function()
{

  // Return if not an haiku
  if (-1 == this.message.search(/hejsan/)) {
    return false;
  }

  return true;

};

function MessageRepository(){}

MessageRepository.prototype.persist = function(entity, callback)
{

  if(!url){
    return callback({'error':true});
  }

  mongo.connect(url, function (err, db) {

    if (!err) {

      var obj = {
        'from': entity.from, 
        'to': entity.to, 
        'message': entity.message, 
        'date': entity.date, 
        'visibility': entity.visibility,
        'starred': entity.starred
      };

      if(entity['_id']){
        obj['_id'] = new ObjectID(entity._id);
      }

      db.collection('msg').save(obj, function(er,rs) {
          return callback(er);
      });
    } else{
        return callback(err);
    }
  });  
}



MessageRepository.prototype.findOne = function(id, callback)
{
  var objectID = new ObjectID(id);

  mongo.connect(url, function (err, db) {
    db.collection('msg', function(er, collection) {
      collection.findOne({'_id': objectID}, function(err, res){
        callback(err, res);
      });
    });
  });
}


MessageRepository.prototype.find = function(search, callback)
{
  mongo.connect(url, function (err, db) {
    db.collection('msg', function(er, collection) {
      collection.find(search).limit(4).sort({'date':-1}).toArray(function(err, res){
        if(!err){
          callback(res);
        }
      });
    });
  });
}


MessageRepository.prototype.remove = function(id, callback)
{
  var objectID = new ObjectID(id);

  mongo.connect(url, function (err, db) {
    db.collection('msg', function(er, collection) {
      collection.remove({_id:objectID}, function(err, res){
        callback(err, res);
      });
    });
  });
}


MessageRepository.prototype.findToMe = function(callback)
{
  return this.find({
    "to":"Rocksteady"
  }, callback);
}

MessageRepository.prototype.findFromMe = function(callback)
{
  return this.find({
    "from":"Rocksteady"
  }, callback);
}

MessageRepository.prototype.findStarred = function(callback)
{
  return this.find({
    "starred":"true"
  }, callback);
}



// API

exports.index = function(req, res)
{
  res.send('You are probably looking for <a href="http://haikyou.jord.io">haikyou.jord.io</a>');
};




exports.post = function(req, res)
{

  var msg = new Msg();

  if (req.params['id']) {
    // An update
    msg._id = req.params['id'];
  }

  msg.from = req.body.from;
  msg.to = req.body.to;
  msg.message = req.body.message;
  msg.visibility = req.body.visibility || 'private';
  msg.starred = req.body.starred || false;

  console.log(msg);

  var messageRepo = new MessageRepository();

  messageRepo.persist(msg, function(err){
    if (!err) {
      res.json({'message':'success'});    
    } else{
      res.send(400);    
    }
  });
};





exports.getOne = function(req, res)
{
  var messageRepo = new MessageRepository();

  messageRepo.findOne(req.params.id, function(err, entity){
    if (!err) {
      res.json(entity);
    } else {
      res.send(422);
    }
  });  
};



exports.get = function(req, res)
{

  var messageRepo = new MessageRepository();

  if (0 === Object.keys(req.query).length) {
      messageRepo.findToMe(function(entity){
        res.json(entity);
      });  
  }

  else if ("true" == req.query['starred']) {
    messageRepo.findStarred(function(entity){
      res.json(entity);
    });  
  }

  else{
    res.send(422);
  }
};




/*
 * Delete a message
 *
 */
exports.delete = function(req, res)
{
  var messageRepo = new MessageRepository();

  messageRepo.remove(req.params.id, function(err, entity){
    if (!err) {
      res.json(entity);
    } else {
      res.send(422);
    }    
  });

};