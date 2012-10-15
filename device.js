var mongoose = require('mongoose')
  , Schema = mongoose.Schema;


var DatastreamSchema = new Schema({
  name: {type: String, required: true},
  unit: {type: String},
  symbol: {type: String},
  func_cv: {type: String},
  raw: {type: String},
  cv: {type: String},
  status: {type: String, default:'unknown'},
  cosm: {
    feed: {type: String},
    datastream: {type: String}
  }
});

var DeviceSchema = new Schema({
  name: {type:String, required: true, unique: true},
  description: {type:String},
  datastreams: [DatastreamSchema],
});

DeviceSchema.index({'name':1, 'datastreams.name':1},{'unique':1, 'sparse':1});


module.exports = mongoose.model('Device', DeviceSchema);
