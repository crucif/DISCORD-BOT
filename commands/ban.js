module.exports = {
  name: "ban",
  async execute(message, args, helpers) {
    const { embed, userHas, botHas, PermissionsBitField } = helpers;

    if (!userHas(message, PermissionsBitField.Flags.BanMembers)) return message.react("❌");
    if (!botHas(message, PermissionsBitField.Flags.BanMembers)) {
      return message.reply({ embeds: [embed("I need **Ban Members**.")] });
    }

    const member = message.mentions.members.first();
    const reason = args.slice(1).join(" ") || "No reason provided";

    if (!member) return message.reply({ embeds: [embed("Mention someone to ban.")] });
    if (!member.bannable) return message.reply({ embeds: [embed("I can't ban that user.")] });

    await member.ban({ reason });
    return message.reply({ embeds: [embed(`**${member.user.tag}** was banned.`)] });
  }
};
