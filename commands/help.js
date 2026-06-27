module.exports = {
  name: "help",
  async execute(message, args, helpers) {
    const { embed, prefix } = helpers;

    return message.reply({
      embeds: [embed(`
**Moderation**
\`${prefix}ban @user reason\`
\`${prefix}unban userID reason\`
\`${prefix}kick @user reason\`
\`${prefix}time @user\`
\`${prefix}time @user minutes reason\`
\`${prefix}unmute @user\`
\`${prefix}purge amount\`
\`${prefix}purgeall\`
\`${prefix}nuke\`
\`${prefix}lock\`
\`${prefix}unlock\`
\`${prefix}slowmode seconds\`

**Censor Relay**
\`${prefix}blacklist word\`
\`${prefix}blacklist "two word phrase"\`
\`${prefix}whitelist word\`
\`${prefix}blacklistlist\`

**Snipe**
\`${prefix}snipe\` or \`${prefix}s\`
\`${prefix}snipe 2\`
\`${prefix}clearsnipe\` or \`${prefix}cs\`

**Utility**
\`${prefix}prefix newPrefix\`
\`${prefix}ping\`
\`${prefix}say message\`
\`${prefix}embed title | description\`
\`${prefix}avatar @user\`
\`${prefix}userinfo @user\`
\`${prefix}serverinfo\`
      `)]
    });
  }
};
