const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "embed",
  async execute(message, args, helpers) {
    const { embed, userHas, PermissionsBitField } = helpers;

    if (!userHas(message, PermissionsBitField.Flags.ManageMessages)) return message.react("❌");

    const text = args.join(" ");
    if (!text) return message.reply({ embeds: [embed("Use `embed title | description`.")] });

    const [title, description] = text.split("|").map(part => part.trim());

    const customEmbed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle(title || "Embed")
      .setDescription(description || "");

    await message.delete().catch(() => {});
    return message.channel.send({ embeds: [customEmbed] });
  }
};
