const mongoose = require('mongoose');
const Ticket = require('../models/ticket');
const Server = require('../models/server');
module.exports = {
  name: 'new',
  execute: async (client, message, args) => {
    // Find the server's configuration document
    const server = await Server.findOne({
      guildID: message.guild.id
    });
    // This line is self-explanatory, but I'll explain it anyway. If the document is falsy, send this message.
    if (!server) return message.channel.send('Error: There is no configuration document for your server. Please re-add the bot.');
    // Declare the category channel
    const ticketcategory = message.guild.channels.get(server.ticketCategory)
    /*
        if (!ticketcategory.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')) {
          try {
            await ticketcategory.overwritePermissions(server.guildID, {
              READ_MESSAGES: false,
            });
            // await ticketcategory.overwritePermissions(client.user.id, {
            //   MANAGE_CHANNELS: true
            // });
          } catch (e) {
            console.error(e);
            return message.channel.send('I do not have permissions to create a channel.');
          }
        }
        */
    // If the ticket category doesn't exist, create it and update the database
    if (!ticketcategory) {
      // Create it
      ticketcategory = await guild.createChannel('tickets', 'category');
      // Overwrite permissions
      await ticketcategory.overwritePermissions(server.guildID, {
        READ_MESSAGES: false
      });
      // Update database
      await Server.findOneAndUpdate({
        guildID: message.guild.id
      }, {
        $set: {
          ticketCategory: ticketcategory.id
        }
      });
    };
    // If the ticket category has permissions for the @everyone role to read messages, change it
    if (ticketcategory.permissionsFor(server.guildID).has('READ_MESSAGES')) {
      try {
        await ticketcategory.overwritePermissions(server.guildID, {
          READ_MESSAGES: false
        });
      } catch (e) {
        return console.error(e);
      };
    }
    // Find an array of documents (all ticket documents for the server)
    const recent = await Ticket.find({
      guildID: message.guild.id
    });
    // If there are no docs, set ticket # to 1
    // Sort docs to highest ticket # and set ticket # to that plus 1 or if there are none set it to 1
    const sort = recent.sort((a, b) => b.number - a.number);
    const sorted = sort.splice(0, 1);
    const number = sorted[0] ? sorted[0].number + 1 : 1;
    // console.log(sort, sorted, number)
    // LOL I COPY AND PASTed IT
    // from my "cases" code
    let created;
    let m;
    // Try to create the channel with permissions for 
    // LOL LOOK AT THE CHANnnels 
    try {
      // Setup the message object
      m = await message.channel.send('Creating a new channel and ticket with number `' + number + '` .... :walking:');
      // Create a text channel with these parameters.
      created = await message.guild.createChannel(`ticket-${number}`, 'text', [{
        id: message.guild.id,
        deny: ['SEND_MESSAGES', 'READ_MESSAGES']
      }, {
        id: message.author.id,
        allow: ['SEND_MESSAGES', 'READ_MESSAGES']
      }]);
      //  Set the parent (the category) of this text channel
      await created.setParent(ticketcategory);
      // If a whitelist exists, add the people in it to the channel permissions.
      if (server.perms.length >= 1) {
        for (const perm of server.perms) {
          created.overwritePermissions(perm, {
            READ_MESSAGES: true
          });
        }
      }
    } catch (e) {
      return console.error(e);
    };
    const newticket = new Ticket({
      _id: mongoose.Types.ObjectId(),
      guildID: server.guildID,
      channelID: created.id,
      creatorID: message.author.id,
      number: parseInt(number),
      createdTimestamp: message.createdAt
    });
    await newticket.save();
    m.edit('Successfully created a new channel and ticket with number `' + number + '` :white_check_mark:\nChannel is accessible at: <#' + created.id + '>.');
  }
};