require("dotenv").config();
const express = require("express");
const tmiConfig = require("./config")
const {
  getAuthorizationUrl,
  exchangeCodeForTokens,
} = require("./auth/twitchAuth");

const app = express();
const PORT = 3000;
let server;

app.get("/auth/login", (req, res) => {
  const url = getAuthorizationUrl(tmiConfig.scopes);
  res.redirect(url);
});

app.get("/auth/callback", async (req, res) => {
  const { code, error } = req.query;

  if (error) return res.status(400).send(`Erreur Twitch : ${error}`);
  if (!code)  return res.status(400).send("Code manquant.");

  try {
    await exchangeCodeForTokens(code);
    res.send(`
      <h2>✅ Authentification réussie !</h2>
      <p>Tu peux fermer cette fenêtre et lancer le bot :</p>
      <pre>node bot.js</pre>
    `);

    // Arrêt propre du serveur après succès — plus besoin de lui
    setTimeout(() => {
      console.log("🛑 Serveur auth arrêté. Lance maintenant : node bot.js");
      server.close(() => process.exit(0));
    }, 1000);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Erreur lors de l'échange du code.");
  }
});

server = app.listen(PORT, () => {
  console.log("─────────────────────────────────────────");
  console.log("🔐 Serveur d'authentification Twitch");
  console.log("─────────────────────────────────────────");
  console.log(`👉 Ouvre ce lien dans ton navigateur :`);
  console.log(`   http://localhost:${PORT}/auth/login`);
  console.log("─────────────────────────────────────────");
});