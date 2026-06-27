const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageDelete,
  async execute(message, client) {
    if (!message.guild || message.author?.bot) return;

    const channelSnipes = client.snipes.get(message.channel.id) || [];

    channelSnipes.unshift({
      content: message.content || "[no text]",
      author: message.author.tag,
      avatar: message.author.displayAvatarURL(),
      time: Date.now(),
      attachments: [...message.attachments.values()].map(att => att.url)
    });

    if (channelSnipes.length > 10) channelSnipes.pop();
    client.snipes.set(message.channel.id, channelSnipes);
  }
};
