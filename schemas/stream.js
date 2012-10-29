var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var forms = require('forms-mongoose');

function dateNow(){
  return new Date();
}

var streamSchema = new Schema({
  name: {type: String, required: true, forms:{all:{}} },
  unit: {type: String, forms:{all:{}}},
  symbol: {type: String, forms:{all:{}}},
  func_cv: {type: String, default: "function(r){\n return r; \n}", forms:{all:{widget:forms.widgets.textarea()}}},
  raw: {type: String},
  cv: {type: Schema.Types.Mixed},
  status: {type: String, default:'unknown'},
  state: {type: String, default:'unknown'},
  last_raw: {type:Date },
  last_cv: {type:Date },
  last_change: {type: Date, default:dateNow},
  cosm: {
    feed: {type: String},
    datastream: {type: String}
  }
});

streamSchema.index({name: 1});

streamSchema.pre('save', function(next){
  if(this.isModified('raw') && !this.isModified('last_raw')){
    this.last_raw = new Date();
  }
  if(this.isModified('cv')){
    this.last_cv = new Date();
    this.last_change = this.last_cv;
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
streamSchema.statics.findByIdAndUpdateWithPrevious = function(id, update, callback) {
  var doc = this;
  var state='live';
  var previous, updated;
  this.findById(id, found_previous)
  function found_previous(err, stream){
    previous = stream;
    if(err) return found(err);
    if(update.hasOwnProperty('cv')){
      if(update.cv === stream.cv){
        delete update.cv;
        delete update.last_cv;
      }
      else
      {

        update.last_cv = new Date();
        update.last_change = update.last_cv; 
      }
    }
    var last_update = update.last_cv || stream.last_cv;
    var last_raw = update.last_raw || stream.last_raw;
    if((last_raw - last_update) >  (5*60*1000)){
      state='frozen';
    }
    update.state = state;
    doc.findByIdAndUpdate(id, {$set:update}, found_updated);
  }

  function found_updated(err, stream){
    updated=stream;
    found(err);
  }

  function found(err){
    callback(null, {previous:previous, updated:updated});
  }
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