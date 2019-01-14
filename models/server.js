const mongoose = require('mongoose');
const server = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  guildName: String,
  ticketCategory: String,
  perms: Array
});
module.exports = mongoose.model('Server', server);