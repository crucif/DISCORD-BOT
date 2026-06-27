const { Events } = require("discord.js");
const { getConfig } = require("../utils/config");

async function handleReaction(reaction, user, addRole) {
  if (user.bot) return;

  if (reaction.partial) {
    try { await reaction.fetch(); } catch { return; }
  }

  const config = getConfig();
  const rules = Array.isArray(config.reactionRoles) ? config.reactionRoles : [];

  const match = rules.find(rule =>
    rule.messageId === reaction.message.id &&
    (rule.emoji === reaction.emoji.name || rule.emoji === reaction.emoji.id)
  );

  if (!match) return;

  const member = await reaction.message.guild.members.fetch(user.id).catch(() => null);
  if (!member) return;

  if (addRole) {
    await member.roles.add(match.roleId).catch(() => {});
  } else {
    await member.roles.remove(match.roleId).catch(() => {});
  }
}

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(reaction, user) {
    await handleReaction(reaction, user, true);
  }
};
