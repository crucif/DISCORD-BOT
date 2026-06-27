const { removeWord } = require("../utils/blacklist");

module.exports = {
  name: "whitelist",
  async execute(message, args, helpers) {
    const { embed, userHas, PermissionsBitField } = helpers;

    if (!userHas(message, PermissionsBitField.Flags.ManageGuild)) return message.react("❌");

    const word = args.join(" ").toLowerCase();
    if (!word) return message.reply({ embeds: [embed("Give me a word to whitelist.")] });

    const removed = removeWord(word);

    return message.reply({
      embeds: [embed(removed ? `Removed \`${word}\` from the blacklist.` : `\`${word}\` is not blacklisted.`)]
    });
  }
};
