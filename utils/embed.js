const { EmbedBuilder } = require("discord.js");

function embed(text) {
  return new EmbedBuilder()
    .setColor(0x2b2d31)
    .setDescription(text);
}

function titledEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(0x2b2d31)
    .setTitle(title)
    .setDescription(description || "");
}

module.exports = { embed, titledEmbed };
