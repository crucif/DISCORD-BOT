module.exports = {
  name: "unmute",
  aliases: ["untimeout"],
  async execute(message, args, helpers) {
    const { embed, userHas, botHas, PermissionsBitField } = helpers;

    if (!userHas(message, PermissionsBitField.Flags.ModerateMembers)) return message.react("❌");
    if (!botHas(message, PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply({ embeds: [embed("I need **Moderate Members**.")] });
    }

    const member = message.mentions.members.first();

    if (!member) return message.reply({ embeds: [embed("Mention someone to unmute.")] });
    if (!member.moderatable) return message.reply({ embeds: [embed("I can't unmute that user.")] });

    await member.timeout(null);
    return message.reply({ embeds: [embed(`${member} was unmuted.`)] });
  }
};
