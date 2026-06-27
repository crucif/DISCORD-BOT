const { AttachmentBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { getConfig } = require("./config");

async function fetchAttachments(message) {
  const files = [];

  for (const attachment of message.attachments.values()) {
    try {
      const response = await fetch(attachment.url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      files.push(new AttachmentBuilder(buffer, { name: attachment.name || "attachment.png" }));
    } catch {
      // If downloading fails, skip this attachment.
    }
  }

  return files;
}

async function getReplyData(message) {
  let repliedUserId = null;
  let replyEmbed = null;

  if (!message.reference?.messageId) {
    return { repliedUserId, replyEmbed };
  }

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
      .setDescription(repliedMessage.content ? repliedMessage.content.slice(0, 300) : "[attachment only]");
  } catch {
    // Message may be too old or unavailable.
  }

  return { repliedUserId, replyEmbed };
}

async function getRelayChannel(message) {
  const config = getConfig();

  if (config.relayMode === "mod-channel" && config.relayChannelId) {
    const channel = await message.guild.channels.fetch(config.relayChannelId).catch(() => null);
    if (channel?.isTextBased()) return channel;
  }

  return message.channel;
}

async function relayDeletedMessage(message) {
  const channel = await getRelayChannel(message);

  const perms = channel.permissionsFor(message.guild.members.me);
  if (!perms?.has([PermissionsBitField.Flags.ManageWebhooks, PermissionsBitField.Flags.SendMessages])) {
    console.log("Missing relay permissions.");
    return;
  }

  const { repliedUserId, replyEmbed } = await getReplyData(message);
  const files = await fetchAttachments(message);
  const replyPing = repliedUserId ? `<@${repliedUserId}> ` : "";
  const username = message.member?.displayName || message.author.username;
  const avatarURL = message.author.displayAvatarURL();
  const content = `${replyPing}${message.content || ""}`.trim() || "[attachment only]";

  const webhooks = await channel.fetchWebhooks();
  let webhook = webhooks.find(wh => wh.name === "RelayHook" && wh.owner?.id === message.client.user.id);

  if (!webhook) {
    webhook = await channel.createWebhook({
      name: "RelayHook",
      avatar: message.client.user.displayAvatarURL()
    });
  }

  await message.delete().catch(() => {});

  await webhook.send({
    content,
    username,
    avatarURL,
    files,
    embeds: replyEmbed ? [replyEmbed] : [],
    allowedMentions: { parse: ["users"] }
  });
}

module.exports = { relayDeletedMessage };
