var mongoose = require('mongoose')
  , Logger = require('devnull')
  , Extend = require('./lib/extend');

var DEFAULTS = {
  host:'localhost',
  port: 27017,
  dbname: 'hydra'
}


var log = new Logger();
var deviceSchema =  require('./schemas/device');
var userSchema = require('./schemas/user');
var streamSchema = require('./schemas/stream');






function Models(options) {
  var conf = Extend(DEFAULTS, options);
  var db = mongoose.createConnection(conf.host, conf.dbname, conf.port, {});

  db.on("open", function(err){
    if (err) throw err;
    log.info("Successfully opened models");
  });

  this.Device = db.model('Device', deviceSchema);
  this.User = db.model('User', userSchema);


  this.Stream = db.model('Stream', streamSchema);
}


module.exports = Models;

