module.exports = {
  name: "purge",
  aliases: ["clear"],
  async execute(message, args, helpers) {
    const { embed, userHas, botHas, PermissionsBitField } = helpers;

    if (!userHas(message, PermissionsBitField.Flags.ManageMessages)) return message.react("❌");
    if (!botHas(message, PermissionsBitField.Flags.ManageMessages)) {
      return message.reply({ embeds: [embed("I need **Manage Messages**.")] });
    }

    const amount = parseInt(args[0]);
    if (!amount || amount < 1 || amount > 100) {
      return message.reply({ embeds: [embed("Use `purge 1-100`.")] });
    }

    await message.channel.bulkDelete(amount, true);
    const done = await message.channel.send({ embeds: [embed(`Deleted **${amount}** messages.`)] });
    setTimeout(() => done.delete().catch(() => {}), 3000);
  }
};
