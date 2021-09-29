const { Client, Intents } = require("discord.js");
const { token } = require("./config.json");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  console.log(message);
  if (message.content === "ping") {
    message.reply("pong");
  }
});

// Login to Discord with your client's token
client.login(token);
