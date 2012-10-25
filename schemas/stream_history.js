var mongoose = require('mongoose')
  , Schema = mongoose.Schema;


var streamHistorySchema = new Schema({
  stream: {type:Schema.Types.ObjectId, ref:'Stream', required: true},
  timestamp: {type:Date, required: true},
  raw: {type:String, required: true},
  cv: {type:Schema.Types.Mixed, required: true},
  status: {type: String, default:'unknown'}
});


streamHistorySchema.index({stream: 1, timestamp:1});



module.exports = streamHistorySchema;
