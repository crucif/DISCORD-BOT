const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "userinfo",
  async execute(message) {
    const member = message.mentions.members.first() || message.member;

    const userEmbed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle("User Info")
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        { name: "User", value: `${member.user.tag}`, inline: true },
        { name: "ID", value: member.id, inline: true },
        { name: "Joined", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: "Created", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
      );

    return message.channel.send({ embeds: [userEmbed] });
  }
};
