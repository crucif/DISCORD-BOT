const { loadBlacklist } = require("../utils/blacklist");

module.exports = {
  name: "blacklistlist",
  async execute(message, args, helpers) {
    const { embed } = helpers;
    const words = loadBlacklist();

    return message.reply({
      embeds: [embed(words.length ? words.map(w => `\`${w}\``).join(", ") : "Blacklist is empty.")]
    });
  }
};
