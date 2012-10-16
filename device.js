var mongoose = require('mongoose')
  , Schema = mongoose.Schema;


var DatastreamSchema = new Schema({
  name: {type: String, required: true, forms:{all:{}} },
  unit: {type: String, forms:{all:{}}},
  symbol: {type: String, forms:{all:{}}},
  func_cv: {type: String, forms:{all:{}}},
  raw: {type: String},
  cv: {type: String},
  status: {type: String, default:'unknown'},
  cosm: {
    feed: {type: String},
    datastream: {type: String}
  }
});



var deviceSchema = new Schema({
  name: {type:String, required: true, unique: true, forms:{all:{}} },
  description: {type:String,  forms:{all:{}} },
  datastreams: [DatastreamSchema],
});

deviceSchema.index({'name':1, 'datastreams.name':1},{'unique':1, 'sparse':1});

deviceSchema.statics.find_funcCv = function (callback){
  this.find({'datastreams.func_cv':{$exists:true}}).select('_id name datastreams.id datastreams.name datastreams.func_cv').exec(callback);
}

/*
  @values Object {raw:, status:, [cv]}
*/
deviceSchema.statics.updateStreamValues = function(device, stream, values, callback) {
  var set = {};
  for(var key in values){
    if(values.hasOwnProperty(key)){
      set['datastreams.$.' + key] = values[key];
    }
  }
  this.update({name:device, "datastreams.name":stream} , 
        {$set:set}, callback); 
}


module.exports = mongoose.model('Device', deviceSchema);
