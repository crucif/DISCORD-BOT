const fs = require("fs");
const BLACKLIST_FILE = "./blacklist.json";

function ensureBlacklist() {
  if (!fs.existsSync(BLACKLIST_FILE)) {
    fs.writeFileSync(BLACKLIST_FILE, JSON.stringify(["test word"], null, 2));
  }
}

function loadBlacklist() {
  ensureBlacklist();

  try {
    const words = JSON.parse(fs.readFileSync(BLACKLIST_FILE, "utf8"));
    return Array.isArray(words)
      ? words.map(word => String(word).trim().toLowerCase()).filter(Boolean)
      : [];
  } catch {
    return [];
  }
}

function saveBlacklist(words) {
  const cleaned = [...new Set(words.map(word => String(word).trim().toLowerCase()).filter(Boolean))];
  fs.writeFileSync(BLACKLIST_FILE, JSON.stringify(cleaned, null, 2));
}

function addWord(word) {
  const words = loadBlacklist();
  const cleaned = String(word).trim().toLowerCase();

  if (!cleaned || words.includes(cleaned)) return false;

  words.push(cleaned);
  saveBlacklist(words);
  return true;
}

function removeWord(word) {
  const words = loadBlacklist();
  const cleaned = String(word).trim().toLowerCase();
  const filtered = words.filter(w => w !== cleaned);

  if (filtered.length === words.length) return false;

  saveBlacklist(filtered);
  return true;
}

function messageContainsBlacklistedWord(content) {
  const lower = String(content || "").toLowerCase();
  const words = loadBlacklist();
  return words.find(word => lower.includes(word)) || null;
}

module.exports = {
  ensureBlacklist,
  loadBlacklist,
  saveBlacklist,
  addWord,
  removeWord,
  messageContainsBlacklistedWord
};
