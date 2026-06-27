module.exports = {
  name: "clearsnipe",
  aliases: ["cs"],
  async execute(message, args, helpers) {
    const { embed, client } = helpers;
    client.snipes.delete(message.channel.id);
    return message.reply({ embeds: [embed("Snipe cleared.")] });
  }
};
