module.exports = {
  name: "kick",
  async execute(message, args, helpers) {
    const { embed, userHas, botHas, PermissionsBitField } = helpers;

    if (!userHas(message, PermissionsBitField.Flags.KickMembers)) return message.react("❌");
    if (!botHas(message, PermissionsBitField.Flags.KickMembers)) {
      return message.reply({ embeds: [embed("I need **Kick Members**.")] });
    }

    const member = message.mentions.members.first();
    const reason = args.slice(1).join(" ") || "No reason provided";

    if (!member) return message.reply({ embeds: [embed("Mention someone to kick.")] });
    if (!member.kickable) return message.reply({ embeds: [embed("I can't kick that user.")] });

    await member.kick(reason);
    return message.reply({ embeds: [embed(`**${member.user.tag}** was kicked.`)] });
  }
};
