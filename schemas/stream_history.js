var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , moment = require('moment');

var streamHistorySchema = new Schema({
  stream: {type:Schema.Types.ObjectId, ref:'Stream', required: true},
  timestamp: {type:Date, required: true},
  raw: {type:String, required: true},
  cv: {type:Schema.Types.Mixed, required: true},
  status: {type: String, default:'unknown'}
});


streamHistorySchema.index({stream: 1, timestamp:1});

streamHistorySchema.virtual('date').get(function () {
  return moment(this.timestamp).format('YYYY-MM-DD hh:mm:ss');
});


module.exports = streamHistorySchema;
