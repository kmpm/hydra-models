var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var forms = require('forms-mongoose')



var deviceSchema = new Schema({
  name: {type:String, required: true, unique: true, forms:{all:{}} },
  description: {type:String,  forms:{all:{}} },
  streams: [{type:Schema.Types.ObjectId, ref:'Stream'}]
});




deviceSchema.statics.createForm = function(){
  return forms.create(this);
}



module.exports = deviceSchema;
