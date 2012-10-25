var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var forms = require('forms-mongoose')



var deviceSchema = new Schema({
  name: {type:String, required: true, unique: true, forms:{all:{}} },
  description: {type:String,  forms:{all:{}} },
  streams: [{type:Schema.Types.ObjectId, ref:'Stream'}]
});

// deviceSchema.pre('remove', function(next){
//   //remove streams
//   next();
// });


deviceSchema.statics.createForm = function(){
  return forms.create(this);
}


deviceSchema.statics.removeFull = function(filter, callback){
  this.find(filter)
    .populate("streams")
    .exec(function(err, list){
      if(err) return callback(err);
      list.forEach(function(device){
        device.streams.forEach(function(stream){
          stream.remove();
        });
        device.remove();
      });
      callback(null);
    });
} 


module.exports = deviceSchema;
