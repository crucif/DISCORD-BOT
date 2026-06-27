const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "avatar",
  async execute(message) {
    const user = message.mentions.users.first() || message.author;

    const avatarEmbed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle(`${user.username}'s Avatar`)
      .setImage(user.displayAvatarURL({ size: 1024 }));

    return message.channel.send({ embeds: [avatarEmbed] });
  }
};
