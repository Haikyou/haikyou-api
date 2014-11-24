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
	email: {type: String, required: true},
	image: [Image]
});

// Map username -> id
User.virtual('id').get(function(){
	return this.username;
});

// Map id -> username
User.virtual('id').set(function(id){
	this.username = id;
});
User.set('toJSON', { getters: true });

var UserModel = mongoose.model('User', User);

var Image = new Schema({
	url: String
});
var ImageModel = mongoose.model('Image', Image);


var Message = new Schema({
	message: {type: String, required: true},
	from: {type: String, required: true},
	to: {type: String},
	visibility: {type: Boolean, default: false},
	starred: {type: Boolean, default: false},
	date: {type: Date, default: Date.now},
	type: {type: String, required: true}
});

// Map username -> id
Message.virtual('id').get(function(){
	return this._id.toHexString();
});

// Map id -> username
Message.virtual('id').set(function(id){
	this._id = id;
});

Message.set('toObject', { virtuals: true });
Message.set('toJSON', { getters: true, virtuals: true });



var MessageModel = mongoose.model('Message', Message);






// API
exports.me = function(req, res)
{
	return UserModel.findOne({username:'rhymn'}, function(err, user){
		if (!err) {
			return res.send(user);
		} else {
			return res.send(422);
		}
	});
}

exports.user = function(req, res)
{
	var input = req.params;

	return UserModel.findOne({username:input.id}, function(err, user){
		if (!err) {
			return res.send(user);
		} else {
			return res.send(422);
		}
	});
}

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


exports.userUpdate = function(req, res)
{
	var input = req.body;

	return UserModel.findById(req.params.id, function(err, user){
		user.email = input.email;
		user.image = input.image;

		return user.save(function(err){
			if (!err) {
				res.json({'message':'success'});
			} else{
				console.log(err);
			}                
		});
	});
}

/*
 * Gets all conversation or
 *
 */
exports.messages = function(req, res)
{
	// If there is no query objects, get all
	if (0 === Object.keys(req.query).length) {
		return MessageModel.find(function (err, messages) {
			if (!err) {
				return res.send(messages);
			} else {
				return console.log(err);
			}
		});
	}

	// me:true -> Show messages from me
	else if (req.query.me) {

		// Pass along the query object
		return MessageModel.find({'from':'Bebop'}, function (err, messages) {
			if (!err) {
				return res.send(messages);
			} else {
				return console.log(err);
			}
		});
	}

	else{

		// Pass along the query object
		return MessageModel.find(req.query, function (err, messages) {
			if (!err) {
				return res.send(messages);
			} else {
				return console.log(err);
			}
		});
	}
}



/*
 * Get one message
 *
 */
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
		visibility: input.visibility,
		type: input.type
	});

	message.save(function (err) {
		if (!err) {
			res.json(message);
		} else{
			console.log(err);
		}
	});
}



exports.messageUpdate = function(req, res)
{

	var input = req.body;

	return MessageModel.findById(req.params.id, function(err, message){

		console.log(message);

		message.message = input.message;
		message.from = input.from;
		message.to = input.to;
		message.starred = input.starred;
		message.visibility = input.visibility;

		return message.save(function(err){
			if (!err) {
				console.log(message);
				res.json(message);
			} else{
				console.log(err);
				res.json(422);
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



