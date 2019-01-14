const Discord = require('discord.js');
const Server = require('../models/server');
module.exports = {
  name: 'whitelist',
  execute: async (client, message, args) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('Error: This command requires the `ADMINISTRATOR` permission to use.');
    const server = await Server.findOne({
      guildID: message.guild.id
    });
    let roles = [];
    let members = [];
    if (!server.perms || server.perms.length < 1) return message.channel.send('The whitelist is empty.');
    for (const perm of server.perms) {
      const member = message.guild.members.get(perm);
      const role = message.guild.roles.get(perm);
      if (member) members.push(member);
      if (role) roles.push(role);
      if (!member && !role) continue;
    }
    roles = roles.length > 0 ? roles.join('\n') : 'No roles';
    members = members.length > 0 ? members.join('\n') : 'No members';
    const embed = new Discord.RichEmbed()
      .setAuthor('Whitelist', message.guild.iconURL)
      .addField('Users', `${members}`)
      .addField('Roles', `${roles}`)
      .setColor('#36393f');
    message.channel.send(embed);
  }
};