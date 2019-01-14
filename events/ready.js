module.exports = async client => {
  console.log(`Logged in as ${client.user.tag}`);
  /*
    let i = 0;
    let count = 0;
    */
  // Count how many users are in each guild the bot is in.
  /*
  client.guilds.forEach(guild => {
    count += guild.memberCount;
  });
  */
  await client.user.setActivity(`@Zetsu help`);
  console.log(`Presence set to "@Zetsu help"`);
  // Cool loop to change statuses. Any more than 2 would require a change in the code.
  /*
  setInterval(() => {
    if (i === 0) {
      client.user.setActivity(activities[i], {
        type: "WATCHING"
      });

      return i += 1;
    }
    if (i === 1) {
      client.user.setActivity(activities[i], {
        type: "PLAYING"
      });
      return i -= 1;
    }
  }, 10000);
  */
}