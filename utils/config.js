const fs = require("fs");
const CONFIG_FILE = "./config.json";

const defaultConfig = {
  prefix: ",",
  ownerIds: ["PASTE_YOUR_USER_ID_HERE"],
  nukeWhitelist: ["PASTE_YOUR_USER_ID_HERE"],
  relayMode: "same-channel",
  relayChannelId: "",
  reactionRoles: []
};

function ensureConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
    return;
  }

  const config = getConfig();
  const merged = { ...defaultConfig, ...config };
  saveConfig(merged);
}

function getConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  } catch {
    return { ...defaultConfig };
  }
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

function getPrefix() {
  return getConfig().prefix || ",";
}

function setPrefix(prefix) {
  const config = getConfig();
  config.prefix = prefix;
  saveConfig(config);
}

module.exports = {
  CONFIG_FILE,
  ensureConfig,
  getConfig,
  saveConfig,
  getPrefix,
  setPrefix
};
