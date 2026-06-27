require("dotenv").config();

const fs = require("fs");
const path = require("path");
const {
  Client,
  GatewayIntentBits,
  Events,
  PermissionsBitField,
  AttachmentBuilder,
  EmbedBuilder,
  Partials
} = require("discord.js");

const { embed } = require("./utils/embed");
const { getConfig, ensureConfig } = require("./utils/config");
const { loadBlacklist, saveBlacklist, ensureBlacklist } = require("./utils/blacklist");

ensureConfig();
ensureBlacklist();

const snipes = new Map();

if (!fs.existsSync(BLACKLIST_FILE)) {
  fs.writeFileSync(BLACKLIST_FILE, JSON.stringify(["test word"], null, 2));
}

const commands = new Map();

const commandFiles = fs.readdirSync(path.join(__dirname, "commands"))
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.name, command);
} 

let bannedWords = JSON.parse(fs.readFileSync(BLACKLIST_FILE, "utf8"));  
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction
  ]
});

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}`);
});

function embed(text) {
  return new EmbedBuilder()
    .setColor(0x2b2d31)
    .setDescription(text);
}

function userHas(message, permission) {
  return message.member.permissions.has(permission);
}

function botHas(message, permission) {
  return message.guild.members.me.permissions.has(permission);
}

client.on(Events.MessageDelete, async (message) => {
  if (!message.guild || message.author?.bot) return;if (command === "purgeall") {
  if (!userHas(message, PermissionsBitField.Flags.ManageMessages)) return message.react("❌");
  if (!botHas(message, PermissionsBitField.Flags.ManageMessages)) {
    return message.reply({ embeds: [embed("I need **Manage Messages**.")] });
  }

  await message.reply({ embeds: [embed("Purging channel...")] });

  let deleted;
  do {
    deleted = await message.channel.bulkDelete(100, true).catch(() => null);
  } while (deleted && deleted.size >= 2);

  return message.channel.send({ embeds: [embed("Channel purged.")] });
}if (command === "nuke") {
  if (!userHas(message, PermissionsBitField.Flags.ManageChannels)) return message.react("❌");
  if (!botHas(message, PermissionsBitField.Flags.ManageChannels)) {
    return message.reply({ embeds: [embed("I need **Manage Channels**.")] });
  }

  const oldChannel = message.channel;

  const newChannel = await oldChannel.clone({
    name: oldChannel.name,
    reason: `Channel nuked by ${message.author.tag}`
  });

  await newChannel.setPosition(oldChannel.position);
  await oldChannel.delete(`Channel nuked by ${message.author.tag}`);

  return newChannel.send({ embeds: [embed("💥 Channel nuked.")] });
}

  snipes.set(message.channel.id, {
    content: message.content || "[no text]",
    author: message.author.tag,
    avatar: message.author.displayAvatarURL(),
    time: Date.now(),
    attachments: [...message.attachments.values()].map(att => att.url)
  });
});

client.on(Events.MessageCreate, async (message) => {
  try {
    if (message.author.bot || !message.guild) return;

    delete require.cache[require.resolve("./config.json")];
const freshConfig = require("./config.json");
const prefix = freshConfig.prefix || ",";

if (message.content.startsWith(prefix)) {
  const args = message.content.slice(prefix.length).trim().match(/"[^"]+"|\S+/g) || [];
  const command = args.shift()?.toLowerCase();
  const cleanArgs = args.map(arg => arg.replace(/^"|"$/g, ""));
      if (command === "help") {
        return message.reply({
          embeds: [embed(`
**Moderation**
\`,ban @user reason\`
\`,kick @user reason\`
\`,time @user\`
\`,time @user minutes reason\`
\`,mute @user\`
\`,timeout @user\`
\`,unmute @user\`
\`,purge amount\`
\`,clear amount\`
\`,lock\`
\`,unlock\`
\`,slowmode seconds\`

**Censor**
\`,blacklist word\`
\`,blacklist "two word phrase"\`
\`,whitelist word\`
\`,blacklistlist\`

**Snipe**
\`,snipe\`
\`,s\`
\`,clearsnipe\`
\`,cs\`

**Utility**
\`,ping\`
\`,say message\`
\`,embed message\`
\`,avatar @user\`
\`,userinfo @user\`
\`,serverinfo\`
          `)]
        });
      }

      if (command === "ping") {
        return message.reply({ embeds: [embed(`Pong! **${client.ws.ping}ms**`)] });
      }

      if (command === "blacklist") {
        if (!userHas(message, PermissionsBitField.Flags.ManageGuild)) return message.react("❌");

        const word = cleanArgs.join(" ").toLowerCase();
        if (!word) return message.reply({ embeds: [embed("Give me a word to blacklist.")] });

        if (bannedWords.includes(word)) {
          return message.reply({ embeds: [embed(`\`${word}\` is already blacklisted.`)] });
        }

        bannedWords.push(word);
        saveBlacklist();

        return message.reply({ embeds: [embed(`Added \`${word}\` to the blacklist.`)] });
      }

      if (command === "whitelist") {
        if (!userHas(message, PermissionsBitField.Flags.ManageGuild)) return message.react("❌");

        const word = cleanArgs.join(" ").toLowerCase();
        if (!word) return message.reply({ embeds: [embed("Give me a word to whitelist.")] });

        if (!bannedWords.includes(word)) {
          return message.reply({ embeds: [embed(`\`${word}\` is not blacklisted.`)] });
        }

        bannedWords = bannedWords.filter(w => w !== word);
        saveBlacklist();

        return message.reply({ embeds: [embed(`Removed \`${word}\` from the blacklist.`)] });
      }

      if (command === "blacklistlist") {
        return message.reply({
          embeds: [embed(
            bannedWords.length
              ? bannedWords.map(w => `\`${w}\``).join(", ")
              : "Blacklist is empty."
          )]
        });
      }

      if (command === "snipe" || command === "s") {
        const snipe = snipes.get(message.channel.id);
        if (!snipe) return message.reply({ embeds: [embed("Nothing to snipe.")] });

        const snipeEmbed = new EmbedBuilder()
          .setColor(0x2b2d31)
          .setAuthor({ name: snipe.author, iconURL: snipe.avatar })
          .setDescription(snipe.content)
          .setFooter({ text: `Deleted ${Math.floor((Date.now() - snipe.time) / 1000)}s ago` });

        if (snipe.attachments.length > 0) {
          snipeEmbed.setImage(snipe.attachments[0]);
        }

        return message.reply({ embeds: [snipeEmbed] });
      }

      if (command === "clearsnipe" || command === "cs") {
        snipes.delete(message.channel.id);
        return message.reply({ embeds: [embed("Snipe cleared.")] });
      }

      if (command === "purge" || command === "clear") {
        if (!userHas(message, PermissionsBitField.Flags.ManageMessages)) return message.react("❌");
        if (!botHas(message, PermissionsBitField.Flags.ManageMessages)) {
          return message.reply({ embeds: [embed("I need **Manage Messages**.")] });
        }

        const amount = parseInt(cleanArgs[0]);
        if (!amount || amount < 1 || amount > 100) {
          return message.reply({ embeds: [embed("Use `,purge 1-100`.")] });
        }

        await message.channel.bulkDelete(amount, true);
        const done = await message.channel.send({ embeds: [embed(`Deleted **${amount}** messages.`)] });
        setTimeout(() => done.delete().catch(() => {}), 3000);
        return;
      }

      if (command === "time" || command === "mute" || command === "timeout") {
        if (!userHas(message, PermissionsBitField.Flags.ModerateMembers)) return message.react("❌");
        if (!botHas(message, PermissionsBitField.Flags.ModerateMembers)) {
          return message.reply({ embeds: [embed("I need **Moderate Members**.")] });
        }

        const member = message.mentions.members.first();
        const minutes = parseInt(cleanArgs[1]) || 5;
        const reason = cleanArgs.slice(2).join(" ") || "No reason provided";

        if (!member) return message.reply({ embeds: [embed("Mention someone to timeout.")] });
        if (!member.moderatable) return message.reply({ embeds: [embed("I can't timeout that user.")] });

        await member.timeout(minutes * 60 * 1000, reason);

        return message.reply({
          embeds: [embed(`${member} was timed out for **${minutes} minutes**.`)]
        });
      }

      if (command === "unmute" || command === "untimeout") {
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

      if (command === "kick") {
        if (!userHas(message, PermissionsBitField.Flags.KickMembers)) return message.react("❌");
        if (!botHas(message, PermissionsBitField.Flags.KickMembers)) {
          return message.reply({ embeds: [embed("I need **Kick Members**.")] });
        }

        const member = message.mentions.members.first();
        const reason = cleanArgs.slice(1).join(" ") || "No reason provided";

        if (!member) return message.reply({ embeds: [embed("Mention someone to kick.")] });
        if (!member.kickable) return message.reply({ embeds: [embed("I can't kick that user.")] });

        await member.kick(reason);
        return message.reply({ embeds: [embed(`**${member.user.tag}** was kicked.`)] });
      }

      if (command === "ban") {
        if (!userHas(message, PermissionsBitField.Flags.BanMembers)) return message.react("❌");
        if (!botHas(message, PermissionsBitField.Flags.BanMembers)) {
          return message.reply({ embeds: [embed("I need **Ban Members**.")] });
        }

        const member = message.mentions.members.first();
        const reason = cleanArgs.slice(1).join(" ") || "No reason provided";

        if (!member) return message.reply({ embeds: [embed("Mention someone to ban.")] });
        if (!member.bannable) return message.reply({ embeds: [embed("I can't ban that user.")] });

        await member.ban({ reason });
        return message.reply({ embeds: [embed(`**${member.user.tag}** was banned.`)] });
      }
if (command === "unban") {
  if (!userHas(message, PermissionsBitField.Flags.BanMembers)) return message.react("❌");
  if (!botHas(message, PermissionsBitField.Flags.BanMembers)) {
    return message.reply({ embeds: [embed("I need **Ban Members**.")] });
  }

  const userId = cleanArgs[0];
  const reason = cleanArgs.slice(1).join(" ") || "No reason provided";

  if (!userId) {
    return message.reply({ embeds: [embed("Use `,unban userID reason`.")] });
  }

  try {
    await message.guild.members.unban(userId, reason);
    return message.reply({ embeds: [embed(`Unbanned **${userId}**.`)] });
  } catch (err) {
    return message.reply({ embeds: [embed("I couldn't unban that user. Make sure the ID is correct and they are banned.")] });
  }
}
      if (command === "lock") {
        if (!userHas(message, PermissionsBitField.Flags.ManageChannels)) return message.react("❌");
        if (!botHas(message, PermissionsBitField.Flags.ManageChannels)) {
          return message.reply({ embeds: [embed("I need **Manage Channels**.")] });
        }

        await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          SendMessages: false
        });

        return message.reply({ embeds: [embed("Channel locked.")] });
      }

      if (command === "unlock") {
        if (!userHas(message, PermissionsBitField.Flags.ManageChannels)) return message.react("❌");
        if (!botHas(message, PermissionsBitField.Flags.ManageChannels)) {
          return message.reply({ embeds: [embed("I need **Manage Channels**.")] });
        }

        await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
          SendMessages: null
        });

        return message.reply({ embeds: [embed("Channel unlocked.")] });
      }

      if (command === "slowmode") {
        if (!userHas(message, PermissionsBitField.Flags.ManageChannels)) return message.react("❌");
        if (!botHas(message, PermissionsBitField.Flags.ManageChannels)) {
          return message.reply({ embeds: [embed("I need **Manage Channels**.")] });
        }

        const seconds = parseInt(cleanArgs[0]);
        if (isNaN(seconds) || seconds < 0 || seconds > 21600) {
          return message.reply({ embeds: [embed("Use `,slowmode seconds`.")] });
        }

        await message.channel.setRateLimitPerUser(seconds);
        return message.reply({ embeds: [embed(`Slowmode set to **${seconds} seconds**.`)] });
      }

      if (command === "say") {
        if (!userHas(message, PermissionsBitField.Flags.ManageMessages)) return message.react("❌");

        const text = cleanArgs.join(" ");
        if (!text) return message.react("❌");

        await message.delete().catch(() => {});
        return message.channel.send(text);
      }

      if (command === "embed") {
        const text = cleanArgs.join(" ");
        if (!text) return message.react("❌");

        return message.channel.send({ embeds: [embed(text)] });
      }

      if (command === "avatar") {
        const user = message.mentions.users.first() || message.author;

        const avatarEmbed = new EmbedBuilder()
          .setColor(0x2b2d31)
          .setTitle(`${user.username}'s Avatar`)
          .setImage(user.displayAvatarURL({ size: 1024 }));

        return message.channel.send({ embeds: [avatarEmbed] });
      }

      if (command === "userinfo") {
        const member = message.mentions.members.first() || message.member;

        const userEmbed = new EmbedBuilder()
          .setColor(0x2b2d31)
          .setTitle("User Info")
          .setThumbnail(member.user.displayAvatarURL())
          .addFields(
            { name: "User", value: `${member.user.tag}`, inline: true },
            { name: "ID", value: member.id, inline: true },
            { name: "Joined", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
            { name: "Created", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
          );

        return message.channel.send({ embeds: [userEmbed] });
      }

      if (command === "serverinfo") {
        const guild = message.guild;

        const serverEmbed = new EmbedBuilder()
          .setColor(0x2b2d31)
          .setTitle("Server Info")
          .setThumbnail(guild.iconURL())
          .addFields(
            { name: "Server", value: guild.name, inline: true },
            { name: "Members", value: `${guild.memberCount}`, inline: true },
            { name: "Owner ID", value: guild.ownerId, inline: true },
            { name: "Created", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }
          );

        return message.channel.send({ embeds: [serverEmbed] });
      }

      return;
    }

    const foundWord = bannedWords.some(word =>
      message.content.toLowerCase().includes(word)
    );

    if (!foundWord) return;

    const permissions = message.channel.permissionsFor(message.guild.members.me);

    if (!permissions.has([
      PermissionsBitField.Flags.ManageMessages,
      PermissionsBitField.Flags.ManageWebhooks
    ])) {
      console.log("Missing Manage Messages or Manage Webhooks!");
      return;
    }

    let repliedUserId = null;
    let replyEmbed = null;

    if (message.reference?.messageId) {
      try {
        const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);

        repliedUserId = repliedMessage.author.id;

        replyEmbed = new EmbedBuilder()
          .setColor(0x2b2d31)
          .setAuthor({
            name: repliedMessage.member?.displayName || repliedMessage.author.username,
            iconURL: repliedMessage.author.displayAvatarURL()
          })
          .setTitle("Replying to this message")
          .setURL(repliedMessage.url)
          .setDescription(
            repliedMessage.content
              ? repliedMessage.content.slice(0, 300)
              : "[attachment only]"
          );
      } catch {
        console.log("Could not fetch replied message.");
      }
    }

    const files = [];

    for (const attachment of message.attachments.values()) {
      const response = await fetch(attachment.url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      files.push(
        new AttachmentBuilder(buffer, {
          name: attachment.name || "attachment.png"
        })
      );
    }

    const replyPing = repliedUserId ? `<@${repliedUserId}> ` : "";
    const username = message.member?.displayName || message.author.username;
    const avatarURL = message.author.displayAvatarURL();

    let webhooks = await message.channel.fetchWebhooks();
    let webhook = webhooks.find(wh => wh.name === "RelayHook");

    if (!webhook) {
      webhook = await message.channel.createWebhook({
        name: "RelayHook",
        avatar: client.user.displayAvatarURL()
      });
    }

    const content = `${replyPing}${message.content || ""}`.trim() || "[attachment only]";

    await message.delete();

    await webhook.send({
      content,
      username,
      avatarURL,
      files,
      embeds: replyEmbed ? [replyEmbed] : [],
      allowedMentions: {
        parse: ["users"]
      }
    });

  } catch (err) {
    console.error("Bot error:", err);
  }
});
const roleId = "PASTE_ROLE_ID_HERE";
const messageId = "PASTE_MESSAGE_ID_HERE";
const emoji = "💛";

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (user.bot) return;
  if (reaction.message.id !== messageId) return;
  if (reaction.emoji.name !== emoji) return;

  const member = await reaction.message.guild.members.fetch(user.id);
  await member.roles.add(roleId);
});

client.on(Events.MessageReactionRemove, async (reaction, user) => {
  if (user.bot) return;
  if (reaction.message.id !== messageId) return;
  if (reaction.emoji.name !== emoji) return;

  const member = await reaction.message.guild.members.fetch(user.id);
  await member.roles.remove(roleId);
});

client.login(process.env.TOKEN);
