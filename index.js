// Add imports
const Discord = require('discord.js');
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

// Declare global variables
const client = new Discord.Client();

// Login to the Mongo server. Format is: mongodb://IP_or_Web_address:port/database/
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true
});

client.commands = new Discord.Collection();
// This loop reads the ./events folder and attaches each event file to the appropriate event.
// Credits to Evie Codes and An Idiot's Guide
fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith('.js')) return;
    const event = require(`./events/${file}`);
    let eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});
// Command handler:
// Read the commands directory and loop through all the files.
// Import each of them and add them to the client.commands collection for later use.
fs.readdir('./commands', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith('js')) return;
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  });
});

// Login to Discord
client.login(process.env.TOKEN);