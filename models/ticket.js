const mongoose = require('mongoose');
const ticket = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  channelID: String,
  creatorID: String,
  number: Number,
  createdTimestamp: String
});
module.exports = mongoose.model('Ticket', ticket);