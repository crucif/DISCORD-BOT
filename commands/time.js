module.exports = {
  name: "time",
  aliases: ["mute", "timeout"],
  async execute(message, args, helpers) {
    const { embed, userHas, botHas, PermissionsBitField } = helpers;

    if (!userHas(message, PermissionsBitField.Flags.ModerateMembers)) return message.react("❌");
    if (!botHas(message, PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply({ embeds: [embed("I need **Moderate Members**.")] });
    }

    const member = message.mentions.members.first();
    const minutes = parseInt(args[1]) || 5;
    const reason = args.slice(2).join(" ") || "No reason provided";

    if (!member) return message.reply({ embeds: [embed("Mention someone to timeout.")] });
    if (!member.moderatable) return message.reply({ embeds: [embed("I can't timeout that user.")] });

    await member.timeout(minutes * 60 * 1000, reason);

    return message.reply({ embeds: [embed(`${member} was timed out for **${minutes} minutes**.`)] });
  }
};
