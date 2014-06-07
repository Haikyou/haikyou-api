// Local settings
try {
  var config = require('../config');
} catch (e) {}

// Get URL from Environment or Local config
var url = process.env.MONGOHQ_URL || config.MONGOHQ_URL;

// Database Abstraction Layer - Mongoose
var mongoose = require('mongoose');
mongoose.connect(url);
var Schema = mongoose.Schema;





// Schemas & Models
var User = new Schema({
	username: {type: String, required: true},
	email: {type: String, required: true}
});
var UserModel = mongoose.model('User', User);

var Message = new Schema({
	message: {type: String, required: true},
	from: {type: String, required: true},
	to: {type: String},
	visibility: {type: Boolean},
	starred: {type: Boolean},
	date: {type: Date, default: Date.now}
});
var MessageModel = mongoose.model('Message', Message);






// API
exports.users = function(req, res)
{
	return UserModel.find(function(err, users){
		if (!err) {
			return res.send(users);
		} else {
			return res.send(422);
		}
	});
}

exports.userCreate = function(req, res)
{
	var user = new UserModel({
		username: req.body.username,
		email: req.body.email
	});    

	user.save(function(err){
		if (!err) {
			res.json({'message':'success'});
		} else{
			console.log(err);
		}
	});

	return res.send(user);
}



exports.messages = function(req, res)
{
  return MessageModel.find(function (err, messages) {
	if (!err) {
	  return res.send(messages);
	} else {
	  return console.log(err);
	}
  });
}



exports.message = function(req, res)
{
	var input = req.params;

	return MessageModel.findById(input.id, function (err, message) {
		if (!err) {
			return res.send(message);
		} else {
			console.log(err);
			return res.send(422);
		}
	});
}


exports.messageCreate = function(req, res)
{
	var input = req.body;

	var message = new MessageModel({
		message: input.message,
		from: input.from,
		to: input.to,
		visibility: input.visibility
	});

	message.save(function (err) {
		if (!err) {
			res.json({'message':'success'});
		} else{
			console.log(err);
		}
	});
}



exports.messageUpdate = function(req, res)
{

	var input = req.body;

	console.log(input.starred);

	return MessageModel.findById(req.params.id, function(err, message){
		message.message = input.message;
		message.from = input.from;
		message.to = input.to;
		message.starred = input.starred;
		message.visibility = input.visibility;

		return message.save(function(err){
			if (!err) {
				res.json({'message':'success'});
			} else{
				console.log(err);
			}                
		});
	});
}




exports.messageDelete = function(req, res)
{
	var input = req.params;

	return MessageModel.findById(input.id, function(err, message){
		return message.remove(function(err){
			if (!err) {
				res.json({'message':'Message was deleted'});
			} else{
				console.log(err);
				res.json(422);
			}                
		});
	});
}






exports.index = function(req, res)
{
  res.send('You are probably looking for <a href="http://haikyou.jord.io">haikyou.jord.io</a>');
};



