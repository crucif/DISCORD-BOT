const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "snipe",
  aliases: ["s"],
  async execute(message, args, helpers) {
    const { embed, client } = helpers;
    const channelSnipes = client.snipes.get(message.channel.id);

    if (!channelSnipes || channelSnipes.length === 0) {
      return message.reply({ embeds: [embed("Nothing to snipe.")] });
    }

    const index = parseInt(args[0]) || 1;
    const snipe = channelSnipes[index - 1];

    if (!snipe) {
      return message.reply({ embeds: [embed(`No snipe found at #${index}.`)] });
    }

    const snipeEmbed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setAuthor({ name: snipe.author, iconURL: snipe.avatar })
      .setDescription(snipe.content)
      .setFooter({ text: `Snipe ${index}/${channelSnipes.length} • Deleted ${Math.floor((Date.now() - snipe.time) / 1000)}s ago` });

    if (snipe.attachments.length > 0) {
      snipeEmbed.setImage(snipe.attachments[0]);
    }

    return message.reply({ embeds: [snipeEmbed] });
  }
};
