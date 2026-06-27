module.exports = {
  name: "say",
  async execute(message, args, helpers) {
    const { userHas, PermissionsBitField } = helpers;

    if (!userHas(message, PermissionsBitField.Flags.ManageMessages)) return message.react("❌");

    const text = args.join(" ");
    if (!text) return message.react("❌");

    await message.delete().catch(() => {});
    return message.channel.send(text);
  }
};
