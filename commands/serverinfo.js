const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "serverinfo",
  async execute(message) {
    const guild = message.guild;

    const serverEmbed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle("Server Info")
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: "Server", value: guild.name, inline: true },
        { name: "Members", value: `${guild.memberCount}`, inline: true },
        { name: "Owner ID", value: guild.ownerId, inline: true },
        { name: "Created", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }
      );

    return message.channel.send({ embeds: [serverEmbed] });
  }
};
