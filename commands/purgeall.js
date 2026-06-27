module.exports = {
  name: "purgeall",
  async execute(message, args, helpers) {
    const { embed, userHas, botHas, PermissionsBitField } = helpers;

    if (!userHas(message, PermissionsBitField.Flags.ManageMessages)) return message.react("❌");
    if (!botHas(message, PermissionsBitField.Flags.ManageMessages)) {
      return message.reply({ embeds: [embed("I need **Manage Messages**.")] });
    }

    const startMsg = await message.reply({ embeds: [embed("🧹 Purging this channel...")] });

    let deletedTotal = 0;
    let deleted;

    do {
      deleted = await message.channel.bulkDelete(100, true).catch(() => null);
      if (deleted) deletedTotal += deleted.size;
    } while (deleted && deleted.size >= 2);

    await startMsg.delete().catch(() => {});

    const doneMsg = await message.channel.send({
      embeds: [embed(`✅ Purge complete. Deleted **${deletedTotal}** messages.`)]
    });

    setTimeout(() => doneMsg.delete().catch(() => {}), 5000);
  }
};
