const { addWord } = require("../utils/blacklist");

module.exports = {
  name: "blacklist",
  async execute(message, args, helpers) {
    const { embed, userHas, PermissionsBitField } = helpers;

    if (!userHas(message, PermissionsBitField.Flags.ManageGuild)) return message.react("❌");

    const word = args.join(" ").toLowerCase();
    if (!word) return message.reply({ embeds: [embed("Give me a word to blacklist.")] });

    const added = addWord(word);

    return message.reply({
      embeds: [embed(added ? `Added \`${word}\` to the blacklist.` : `\`${word}\` is already blacklisted.`)]
    });
  }
};
