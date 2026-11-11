const axios = require("axios");
const { saveTokens, loadTokens } = require("./tokenStore");
const tmiConfig = require("../config")

const {
    BOT_TWITCH_HELIOS_CLIEND_ID,
    BOT_TWITCH_HELIOS_SECRET,
    TWITCH_REDIRECT_URI,
} = process.env;

const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const TWITCH_AUTHORIZE_URL = "https://id.twitch.tv/oauth2/authorize";

// ─── 1. Générer l'URL d'autorisation ────────────────────────────────────────

function getAuthorizationUrl(scopes = tmiConfig.scopes) {
    const params = new URLSearchParams({
        client_id: BOT_TWITCH_HELIOS_CLIEND_ID,
        redirect_uri: TWITCH_REDIRECT_URI,
        response_type: "code",
        scope: scopes.join(" "),
        // state: crypto.randomUUID() // recommandé en prod pour éviter CSRF
    });
    return `${TWITCH_AUTHORIZE_URL}?${params.toString()}`;
}

// ─── 2. Échanger le code contre les tokens ───────────────────────────────────

async function exchangeCodeForTokens(code) {
  const response = await axios.post(TWITCH_TOKEN_URL, null, {
    params: {
      client_id: BOT_TWITCH_HELIOS_CLIEND_ID,
      client_secret: BOT_TWITCH_HELIOS_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: TWITCH_REDIRECT_URI,
    },
  });

  const { access_token, refresh_token, expires_in } = response.data;

  const tokens = {
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresAt: Date.now() + expires_in * 1000,
  };

  saveTokens(tokens);
  console.log("✅ Tokens générés et sauvegardés.");
  return tokens;
}

// ─── 3. Rafraîchir l'access token ────────────────────────────────────────────

async function refreshAccessToken(refreshToken) {
  const response = await axios.post(TWITCH_TOKEN_URL, null, {
    params: {
      client_id: BOT_TWITCH_HELIOS_CLIEND_ID,
      client_secret: BOT_TWITCH_HELIOS_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
  });

  const { access_token, refresh_token, expires_in } = response.data;

  const tokens = {
    accessToken: access_token,
    refreshToken: refresh_token ?? refreshToken, // Twitch peut renvoyer un nouveau refresh_token
    expiresAt: Date.now() + expires_in * 1000,
  };

  saveTokens(tokens);
  console.log("🔄 Access token rafraîchi.");
  return tokens;
}

// ─── 4. Obtenir un token valide (auto-refresh) ────────────────────────────────

async function getValidAccessToken() {
  const tokens = loadTokens();

  if (!tokens) {
    throw new Error("Aucun token trouvé. Lance d'abord le flux OAuth.");
  }

  const isExpired = Date.now() >= tokens.expiresAt - 60_000; // marge 1 min

  if (isExpired) {
    console.log("⏰ Token expiré, rafraîchissement...");
    return await refreshAccessToken(tokens.refreshToken);
  }

  return tokens;
}

module.exports = {
  getAuthorizationUrl,
  exchangeCodeForTokens,
  refreshAccessToken,
  getValidAccessToken,
};