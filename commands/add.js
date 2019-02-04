const Server = require('../models/server');
module.exports = {
  name: 'add',
  execute: async (client, message, args) => {
    // This line is completely self-explanatory.
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('Error: This command requires the `ADMINISTRATOR` permission to use.');
    // Find the server's configuration document
    const server = await Server.findOne({
      guildID: message.guild.id
    });
    // This line is self-explanatory, but I'll explain it anyway. If the document is falsy, send this message.
    if (!server) return message.channel.send('Error: There is no configuration document for your server. Please re-add the bot.');

    // Default the value of toadd to the first argument
    let toadd = args[0];
    // Make this shorter.
    const mentions = message.mentions;
    // If the command sender has more than one mention, return with an error.
    if (mentions.users.size > 1 || mentions.roles.size > 1) return message.channel.send('Error: You supplied more than one user or role.');
    // Declare the mention variable as a user mention, and, if not, a role mention.
    const mention = mentions.users.first() || mentions.roles.first();
    // If there was no mention supplied and their argument exceeds the maximum length of 19 characters (<@!123456789123456>)
    if (!mention && (args[0].length > 18 || args[0].length < 16)) return message.channel.send('Error: Invalid parameters supplied. Make sure you\'re putting a valid user/role mention or user/role ID.');
    // Declare this as a non-mention argument... to be used in latter if statements
    // mines better :
    const verify = client.users.get(args[0]) || message.guild.roles.get(args[0]);
    // If the command sender supplied neither a mention nor a valid snowflake, return with an error.
    if (!verify && !mention) return message.channel.send('Error: Invalid parameters supplied. Make sure you\'re putting a valid user/role mention or user/role ID.');
    // If the command sender supplied only a mention, use the id property of the object in the collection.
    if (!verify && mention) toadd = mention.id;
    // If the command sender supplied a valid snowflake, use it.
    if (verify && !mention) toadd = args[0];
    // If the supplied snowflake or mention is a role, add an ampersand so it's mentionable.
    const bool = message.guild.roles.get(toadd) ? '&' : '';
    // Set the resolved promise of this message object here to m
    const m = await message.channel.send(`Adding <@${bool}${toadd}> to the whitelist... :walking:`);
    // Await the document update
    try {
      // Check the server document to see if their addition already exists
      if (server.perms.includes(toadd)) return m.edit('Error: This user/role already exists in the whitelist. :x:');
      // Find and modify the server document. Push their addition onto the whitelist.
      await Server.findOneAndUpdate({
        guildID: server.guildID
      }, {
        $push: {
          perms: toadd
        }
      });

      // Edit the m message object to a success message.
      return m.edit(`Successfully added <@${bool}${toadd}> to the whitelist :white_check_mark:`)

    } catch (e) {
      return console.error(e);
    }

  }
};