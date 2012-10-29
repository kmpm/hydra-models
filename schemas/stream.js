var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var forms = require('forms-mongoose');

var streamSchema = new Schema({
  name: {type: String, required: true, forms:{all:{}} },
  unit: {type: String, forms:{all:{}}},
  symbol: {type: String, forms:{all:{}}},
  func_cv: {type: String, default: "function(r){\n return r; \n}", forms:{all:{widget:forms.widgets.textarea()}}},
  raw: {type: String},
  cv: {type: Schema.Types.Mixed},
  status: {type: String, default:'unknown'},
  last_raw: {type:Date },
  last_cv: {type:Date },
  cosm: {
    feed: {type: String},
    datastream: {type: String}
  }
});

streamSchema.index({name: 1});

streamSchema.pre('save', function(next){
  if(this.isModified('raw')>=0){
    this.last_raw = new Date();
  }
  if(this.isModified('cv')>=0){
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
  return this.findByIdAndUpdate(stream_id, {$set:set}, callback);
}



module.exports = streamSchema;