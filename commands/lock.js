module.exports = {
  name: "lock",
  async execute(message, args, helpers) {
    const { embed, userHas, botHas, PermissionsBitField } = helpers;

    if (!userHas(message, PermissionsBitField.Flags.ManageChannels)) return message.react("❌");
    if (!botHas(message, PermissionsBitField.Flags.ManageChannels)) {
      return message.reply({ embeds: [embed("I need **Manage Channels**.")] });
    }

    await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      SendMessages: false
    });

    return message.reply({ embeds: [embed("Channel locked.")] });
  }
};
