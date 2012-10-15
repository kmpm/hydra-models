var mongoose = require('mongoose')
  , nconf = require('nconf')
  , Logger = require('devnull');

var DEFAULTS = {
  mongo:{
    host:'localhost',
    port: 27017,
    dbname: 'hydra'}
}

nconf.argv()
  .file('config.json')
  .defaults(DEFAULTS);

var conf = nconf.get('mongo');
var log = new Logger();
mongoose.connect(conf.host, conf.dbname, conf.port, {});


mongoose.connection.on("open", function(err){
  if (err) throw err;
  log.info("Successfully opened models");
});

exports.User = require('./user');
exports.Device = require('./device');