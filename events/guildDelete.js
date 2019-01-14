// Import the "Server" model
const Server = require('../models/server');
module.exports = async (client, guild) => {
  try {
    //  Try finding and deleting the server's configuration document.
    await Server.findOneAndDelete({
      guildID: guild.id
    });
    return console.log(`Successfully deleted settings for '${guild.name}' + '${guild.id}'`);
  } catch (e) {
    return console.log(`Failed to delete settings for '${guild.name}' + '${guild.id}'\nError:\n${e}`);
  };
};