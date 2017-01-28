var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Author = new Schema({
  // id: Schema.ObjectId,
  name: String
}, { versionKey: false });

var Book = new Schema({
  // id: Schema.ObjectId,
  title: String,
  author: Author,
  published_at: {type: Date, default: Date.now}
}, { versionKey: false });

module.exports = mongoose.model('book', Book);