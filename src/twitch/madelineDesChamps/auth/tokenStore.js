const fs = require("fs");
const path = require("path");

const TOKEN_FILE = path.join(__dirname, "../tokens.json");

function saveTokens({ accessToken, refreshToken, expiresAt }) {
  const data = { accessToken, refreshToken, expiresAt };
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(data, null, 2));
}

function loadTokens() {
  if (!fs.existsSync(TOKEN_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(TOKEN_FILE, "utf-8"));
  } catch {
    return null;
  }
}

function clearTokens() {
  if (fs.existsSync(TOKEN_FILE)) fs.unlinkSync(TOKEN_FILE);
}

module.exports = { saveTokens, loadTokens, clearTokens };