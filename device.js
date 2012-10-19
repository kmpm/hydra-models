var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var forms = require('forms-mongoose')

var StreamSchema = new Schema({
  name: {type: String, required: true, forms:{all:{}} },
  unit: {type: String, forms:{all:{}}},
  symbol: {type: String, forms:{all:{}}},
  func_cv: {type: String, forms:{all:{widget:forms.widgets.textarea()}}},
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
  streams: [StreamSchema],
});

deviceSchema.index({'name':1, 'streams.name':1},{'unique':1, 'sparse':1});

deviceSchema.statics.find_funcCv = function (callback){
  this.find({'streams.func_cv':{$exists:true}}).select('_id name streams.id streams.name streams.func_cv').exec(callback);
}

deviceSchema.statics.createForm = function(){
  return forms.create(this);
}

deviceSchema.statics.createStreamForm = function() {
  return forms.create(this.schema.paths.streams);
}

/*
  @values Object {raw:, status:, [cv]}
*/
deviceSchema.statics.updateStreamValues = function(device, stream, values, callback) {
  var set = {};
  for(var key in values){
    if(values.hasOwnProperty(key)){
      set['streams.$.' + key] = values[key];
    }
  }
  this.update({name:device, "streams.name":stream} , 
        {$set:set}, callback); 
}


module.exports = mongoose.model('Device', deviceSchema);
