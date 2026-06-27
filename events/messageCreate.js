const { Events, PermissionsBitField } = require("discord.js");
const { getPrefix } = require("../utils/config");
const { embed } = require("../utils/embed");
const { userHas, botHas } = require("../utils/permissions");
const { messageContainsBlacklistedWord } = require("../utils/blacklist");
const { relayDeletedMessage } = require("../utils/relay");

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    try {
      if (message.author.bot || !message.guild) return;

      const prefix = getPrefix();

      if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().match(/"[^"]+"|\S+/g) || [];
        const commandName = args.shift()?.toLowerCase();
        const cleanArgs = args.map(arg => arg.replace(/^"|"$/g, ""));

        const command = client.commands.get(commandName);
        if (!command) return;

        return command.execute(message, cleanArgs, {
          client,
          embed,
          userHas,
          botHas,
          PermissionsBitField,
          prefix
        });
      }

      const matchedWord = messageContainsBlacklistedWord(message.content);
      if (!matchedWord) return;

      const perms = message.channel.permissionsFor(message.guild.members.me);
      if (!perms?.has([PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.ManageWebhooks])) {
        console.log("Missing Manage Messages or Manage Webhooks!");
        return;
      }

      await relayDeletedMessage(message);
    } catch (err) {
      console.error("Bot error:", err);
    }
  }
};
