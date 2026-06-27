const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} = require("discord.js");
const { getConfig } = require("../utils/config");

module.exports = {
  name: "nuke",
  async execute(message, args, helpers) {
    const { embed, userHas, botHas, PermissionsBitField } = helpers;
    const config = getConfig();
    const whitelist = Array.isArray(config.nukeWhitelist) ? config.nukeWhitelist : [];

    if (!whitelist.includes(message.author.id)) {
      return message.reply({ embeds: [embed("❌ You are not whitelisted to use `nuke`.")] });
    }

    if (!userHas(message, PermissionsBitField.Flags.ManageChannels)) return message.react("❌");
    if (!botHas(message, PermissionsBitField.Flags.ManageChannels)) {
      return message.reply({ embeds: [embed("I need **Manage Channels**.")] });
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("confirm_nuke")
        .setLabel("Confirm")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("cancel_nuke")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Secondary)
    );

    const confirmMsg = await message.reply({
      embeds: [embed("⚠️ **Are you sure you want to nuke this channel?**\n\nThis action cannot be undone.")],
      components: [row]
    });

    const collector = confirmMsg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 30000
    });

    collector.on("collect", async interaction => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({
          content: "Only the person who ran the command can use these buttons.",
          ephemeral: true
        });
      }

      if (interaction.customId === "cancel_nuke") {
        collector.stop("cancelled");
        return interaction.update({ embeds: [embed("✅ Nuke cancelled.")], components: [] });
      }

      if (interaction.customId === "confirm_nuke") {
        collector.stop("confirmed");

        const oldChannel = message.channel;
        const newChannel = await oldChannel.clone({
          name: oldChannel.name,
          reason: `Nuked by ${message.author.tag}`
        });

        await newChannel.setPosition(oldChannel.position);
        await oldChannel.delete(`Nuked by ${message.author.tag}`);
        await newChannel.send({ embeds: [embed("💥 Channel successfully nuked.")] });
      }
    });

    collector.on("end", async (_, reason) => {
      if (reason === "time") {
        await confirmMsg.edit({ embeds: [embed("⌛ Nuke request expired.")], components: [] }).catch(() => {});
      }
    });
  }
};
