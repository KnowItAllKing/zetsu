module.exports = {
  name: 'test',
  execute: async (client, message, args) => {
    return message.channel.send('Hi')
  }
}