const { getConfig, saveConfig } = require("../utils/config");

module.exports = {
  name: "reactionrole",
  aliases: ["rr"],
  async execute(message, args, helpers) {
    const { embed, userHas, botHas, PermissionsBitField } = helpers;

    if (!userHas(message, PermissionsBitField.Flags.ManageRoles)) return message.react("❌");
    if (!botHas(message, PermissionsBitField.Flags.ManageRoles)) {
      return message.reply({ embeds: [embed("I need **Manage Roles**.")] });
    }

    const role = message.mentions.roles.first();
    const emoji = args.find(arg => !arg.includes("<@&"));

    if (!role || !emoji) {
      return message.reply({ embeds: [embed("Use `reactionrole @Role 💛`.")] });
    }

    const rrMsg = await message.channel.send({ embeds: [embed(`React with ${emoji} to get ${role}.`)] });
    await rrMsg.react(emoji).catch(() => {});

    const config = getConfig();
    if (!Array.isArray(config.reactionRoles)) config.reactionRoles = [];

    config.reactionRoles.push({
      messageId: rrMsg.id,
      roleId: role.id,
      emoji
    });

    saveConfig(config);

    return message.reply({ embeds: [embed("✅ Reaction role created.")] });
  }
};
