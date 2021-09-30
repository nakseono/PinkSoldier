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

// 구현해야 할 기능
// 1. YouTube API랑 연동해서 노래 불러오기
// 2. LostArk API랑 연동해서 전투정보실 정보 불러오기 (HTML parsing)
