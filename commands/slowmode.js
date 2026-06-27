module.exports = {
  name: "slowmode",
  async execute(message, args, helpers) {
    const { embed, userHas, botHas, PermissionsBitField } = helpers;

    if (!userHas(message, PermissionsBitField.Flags.ManageChannels)) return message.react("❌");
    if (!botHas(message, PermissionsBitField.Flags.ManageChannels)) {
      return message.reply({ embeds: [embed("I need **Manage Channels**.")] });
    }

    const seconds = parseInt(args[0]);
    if (isNaN(seconds) || seconds < 0 || seconds > 21600) {
      return message.reply({ embeds: [embed("Use `slowmode seconds`.")] });
    }

    await message.channel.setRateLimitPerUser(seconds);
    return message.reply({ embeds: [embed(`Slowmode set to **${seconds} seconds**.`)] });
  }
};
