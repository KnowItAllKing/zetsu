const Server = require('../models/server');
const Ticket = require('../models/ticket')
module.exports = {
  name: 'close',
  execute: async (client, message, args) => {
    // This line is completely self-explanatory.
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Error: This command requires the `MANAGE MESSAGES` permission to use.');
    // Find the server's configuration document
    const server = await Server.findOne({
      guildID: message.guild.id
    });
    // This line is self-explanatory, but I'll explain it anyway. If the document is falsy, send this message.
    if (!server) return message.channel.send('Error: There is no configuration document for your server. Please re-add the bot.');
    // If an argument is supplied, follow through to check for an existing document with the corresponding ticket number
    if (args[0]) {
      const ticket = await Ticket.findOneAndUpdate({
        guildID: message.guild.id,
        number: parseInt(args[0])
      }, {
        $set: {
          open: false
        }
      }, {
        new: true
      });
      // If the ticket is not found
      if (!ticket) return message.channel.send('Error: Invalid ticket number. Make sure to enter a valid ticket number to close, or you\'re in a channel connected to a ticket.');
      // Get the channel from the ticket document
      const channel = message.guild.channels.get(ticket.channelID);
      // If there is no channel in the document (a rare occurrence, but might happen)
      if (!channel) return message.channel.send('Error: Channel for supplied ticket not found. This is an internal error. Contact the bot developer to fix this, or manually delete the channel.');
      // Have an error catcher to make sure errors are caught 
      try {
        channel.delete();
      } catch (e) {
        return message.channel.send('I do not have the required permissions to close this ticket and delete the corresponding channel.');
      };
    } else {
      // If there are no arguments supplied, try and delete the channel the command sender is in. Only if there is a ticket connected <-
      const ticket = await Ticket.findOneAndUpdate({
        guildID: message.guild.id,
        channelID: message.channel.id
      }, {
        $set: {
          open: false
        }
      }, {
        new: true
      });

      if (!ticket) return message.channel.send('Error: Invalid ticket number. Make sure to enter a valid ticket number to close, or you\'re in a channel connected to a ticket.');
      try {
        message.channel.delete();
      } catch (e) {
        return message.channel.send('I do not have the required permissions to close this ticket and delete the corresponding channel.');
      };
    };
  }
};