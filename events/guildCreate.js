// Import the "Server" model and mongoose package.
const mongoose = require('mongoose');
const Server = require('../models/server');
module.exports = async (client, guild) => {
  // Look for a category channel named tickets.
  const trycategory = guild.channels.find(ch => ch.name === 'tickets' && ch.type === 'category');
  // Look for a category channel I have permissions for if the tickets category doesn't exist.
  const defaultcategory = guild.channels.find(ch => ch.permissionsFor(guild.me).has('MANAGE_CHANNELS') && ch.type === 'category');
  let category;
  // If neither exist, create a new tickets category and overwrite permissions.
  if (!trycategory && !defaultcategory) {
    try {
      category = await guild.createChannel('tickets', 'category');
      await category.overwritePermissions(guild.id, {
        READ_MESSAGES: false
      });
    } catch (e) {
      return console.error(e);
    };
  };
  // Create a new document with fields of the guild's ID, name, and the category for tickets to be used in the creation of them.
  const server = new Server({
    _id: mongoose.Types.ObjectId(),
    guildID: guild.id,
    guildName: guild.name,
    ticketCategory: trycategory ? trycategory.id : defaultcategory ? defaultcategory.id : category ? category.id : '0',
    perms: []
  });
  try {
    // Try saving the document. Log if it was successfully saved.
    await server.save();
    return console.log(`Successfully saved settings for '${guild.name}' + '${guild.id}'`);
  } catch (e) {
    // Log if it errors.
    return console.log(`Failed to save settings for '${guild.name}' + '${guild.id}'\nError:\n${e}`);
  };
};