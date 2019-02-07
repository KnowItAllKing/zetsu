const Discord = require('discord.js');
const Ticket = require('../models/ticket');
module.exports = {
  name: 'tickets',
  execute: async (client, message, args) => {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Error: This command requires the `MANAGE MESSAGES` permission to use.');
    const tickets = await Ticket.find({
      guildID: message.guild.id,
      open: true
    });
    let msg = '';
    if (tickets.length === 0) return message.channel.send('There are no open tickets. Create one using `zetsu new`.');
    for (const ticket of tickets) {
      const toadd = `Ticket #${ticket.number}\nChannel: <#${ticket.channelID}>\nCreator: <@${ticket.creatorID}>\n\n`;
      msg += toadd;
    }
    message.channel.send(new Discord.RichEmbed().setAuthor('Tickets', message.guild.iconURL).setDescription(msg).setColor('#36393f'));

  }
};