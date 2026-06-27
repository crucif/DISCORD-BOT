const { setPrefix, getPrefix } = require("../utils/config");

module.exports = {
  name: "prefix",
  async execute(message, args, helpers) {
    const { embed, userHas, PermissionsBitField } = helpers;

    if (!userHas(message, PermissionsBitField.Flags.Administrator)) {
      return message.react("❌");
    }

    const newPrefix = args[0];

    if (!newPrefix) {
      return message.reply({ embeds: [embed(`Current prefix: \`${getPrefix()}\``)] });
    }

    if (newPrefix.length > 5) {
      return message.reply({ embeds: [embed("Prefix must be 5 characters or less.")] });
    }

    setPrefix(newPrefix);

    return message.reply({ embeds: [embed(`✅ Prefix changed to \`${newPrefix}\``)] });
  }
};
