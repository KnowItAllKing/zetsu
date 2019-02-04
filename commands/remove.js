const Server = require('../models/server');
module.exports = {
  name: 'remove',
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
    let toremove = args[0];
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
    if (!verify && mention) toremove = mention.id;
    // If the command sender supplied a valid snowflake, use it.
    if (verify && !mention) toremove = args[0];
    // Set the resolved promise of this message object here to m
    // If the supplied snowflake or mention is a role, add an ampersand so it's mentionable.
    const bool = message.guild.roles.get(toremove) ? '&' : '';
    const m = await message.channel.send(`Removing <@${bool}${toremove}> from the whitelist... :walking:`);
    // Await the document update
    try {
      // Check the server document to see if their supplied snowflake exists
      if (!server.perms.includes(toremove)) return m.edit('Error: This user/role is not in the whitelist. :x:');
      // Find and modify the server document. Push their addition onto the whitelist.

      // This is our "to-delete" array, which we will use to delete from our "newarray"
      let array = [];
      // Look through all elements in the whitelist and only add the one that matches.
      for (let i = 0; i < server.perms.length; i++) {
        if (server.perms[i] !== toremove) continue;
        array.push(i);
      }
      // Set our array to a nicer variable
      let newarray = server.perms;
      // Iterate through our "to-delete" array and splice the element of the whitelist
      for (const element of array) {
        newarray.splice(element, 1);
      }
      // Replace the old array of perms with the array not containing the element we just deleted
      await Server.findOneAndUpdate({
        guildID: server.guildID
      }, {
        $set: {
          perms: newarray
        }
      });

      // Edit the m message object to a success message.
      return m.edit(`Successfully removed <@${bool}${toremove}> from the whitelist :white_check_mark:`)

    } catch (e) {
      return console.error(e);
    }

  }
};