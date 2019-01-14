module.exports = async (client, message) => {
  // If the message sender is a bot, return.
  if (message.author.bot) return;
  // If the message was not sent in a guild, return.
  if (!message.guild) return;
  // If our commands folder doesn't have the specified command, return.


  // Define your prefix here. Use however you'd like.
  const prefix = `zetsu`;
  // Our Regular Expression to check if the message starts with a mention of the bot or with the prefix.
  // Used such as: @Zetsu help or zetsu help
  // Ignores cases.
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|\\${prefix})\s*`, 'i');
  // If the command doesn't start with our pattern above, return.
  if (!prefixRegex.test(message.content)) return;


  // Our complete arguments variable, with whitespace trimmed at the ends and split by infinite whitespace.
  let args = message.content.trim().split(/\s+/g)

  // Here's some code for your "prefix" variable. It's either the mention string or the prefix you set.
  // const [, matchedPrefix] = message.content.match(prefixRegex);

  // Our command as a string to look for our file.
  const command = args[1].toLowerCase();
  // Our regular "args" variable
  args = args.slice(2);

  if (!client.commands.has(command)) return;
  try {
    // Get our command from our collection and execute its contents using the parameters supplied
    await client.commands.get(command).execute(client, message, args);
  } catch (e) {
    console.error(e);
    return message.channel.send('An error has occurred.');
  };

};