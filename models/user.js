var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
	username: String,
	email: String,
	password: String,
	GENERATED_VERIFYING_URL: String,
});

var User = mongoose.model('User', userSchema);
module.exports = User;