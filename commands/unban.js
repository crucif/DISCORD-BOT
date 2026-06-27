module.exports = {
  name: "unban",
  async execute(message, args, helpers) {
    const { embed, userHas, botHas, PermissionsBitField } = helpers;

    if (!userHas(message, PermissionsBitField.Flags.BanMembers)) return message.react("❌");
    if (!botHas(message, PermissionsBitField.Flags.BanMembers)) {
      return message.reply({ embeds: [embed("I need **Ban Members**.")] });
    }

    const userId = args[0];
    const reason = args.slice(1).join(" ") || "No reason provided";

    if (!userId) {
      return message.reply({ embeds: [embed("Use `unban userID reason`.")] });
    }

    try {
      await message.guild.members.unban(userId, reason);
      return message.reply({ embeds: [embed(`Unbanned **${userId}**.`)] });
    } catch {
      return message.reply({ embeds: [embed("I couldn't unban that user. Make sure the ID is correct and they are banned.")] });
    }
  }
};
