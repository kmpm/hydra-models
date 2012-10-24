var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , bcrypt = require('bcrypt-nodejs');

var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  login: {type: String, required: true, unique: true},
  name: {type: String},
  email: {type: String, required: true},
  password: {type: String, required: true}
});

// http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
/// https://github.com/shaneGirish/bcrypt-nodejs

UserSchema.pre('save', function(next){
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);

          // override the cleartext password with the hashed one
          user.password = hash;
          next();
      });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, callback) {
    
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};


module.exports = UserSchema;