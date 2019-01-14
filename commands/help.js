const Discord = require('discord.js');
module.exports = {
  name: 'help',
  execute: async (client, message, args) => {
    const embed = new Discord.RichEmbed()
      .setAuthor('Help', message.guild.iconURL)
      .addField('`zetsu add`', 'Add a user or role to the "whitelist" of people who can view all tickets. Requires the `ADMINISTRATOR` permission.\nUsage: `zetsu add @Yahiko`')
      .addField('`zetsu remove`', 'Remove a user or role from the whitelist. Requires the `ADMINISTRATOR` permission.\nUsage: `zetsu remove @Yahiko`')
      .addField('`zetsu new`', 'Create a new ticket.\nUsage: `zetsu new`')
      .addField('`zetsu close`', 'Close a ticket. Requires the `MANAGE MESSAGES` permission.\nUsage: `zetsu close 13` or `zetsu close` in a ticket channel.')
      .addField('`zetsu tickets`', 'View a list of all open tickets. Requires the `MANAGE MESSAGES` permission.\nUsage: `zetsu tickets`')
      .addField('`zetsu whitelist`', 'View a list of all whitelisted users and roles. Requires the `ADMINISTRATOR` permission. \nUsage: `zetsu whitelist`')
      .setColor('#36393f');
    message.channel.send(embed);
  }
};