var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var forms = require('forms-mongoose')

var streamSchema = new Schema({
  name: {type: String, required: true, forms:{all:{}} },
  unit: {type: String, forms:{all:{}}},
  symbol: {type: String, forms:{all:{}}},
  func_cv: {type: String, forms:{all:{widget:forms.widgets.textarea()}}},
  raw: {type: String},
  cv: {type: String},
  status: {type: String, default:'unknown'},
  last_raw: {type:Date },
  last_cv: {type:Date },
  cosm: {
    feed: {type: String},
    datastream: {type: String}
  }
});

streamSchema.pre('save', function(next){
  var mods = this.modifiedPaths();
  if(mods.indexOf('raw')>=0){
    this.last_raw = new Date();
  }
  if(mods.indexOf('cv')>=0){
    this.last_cv = new Date();
  }
  next();
});

streamSchema.statics.find_funcCv = function (callback){
  this.find({'func_cv':{$exists:true}}).select('_id name func_cv').exec(callback);
}

streamSchema.statics.createForm = function(){
  return forms.create(this);
}

/*
  @values Object {raw:, status:, [cv]}
*/
streamSchema.statics.updateStreamValues = function(stream_id, values, callback) {
  var set = {};
  for(var key in values){
    if(values.hasOwnProperty(key)){
      set[key] = values[key];
    }
  }
  this.update({"_id":stream_id} , 
        {$set:set}, callback); 
}



module.exports = streamSchema;