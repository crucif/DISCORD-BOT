module.exports = {
  name: "ping",
  async execute(message, args, helpers) {
    const { embed, client } = helpers;
    return message.reply({ embeds: [embed(`Pong! **${client.ws.ping}ms**`)] });
  }
};
