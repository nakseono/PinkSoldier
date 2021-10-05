const { Client, Intents } = require("discord.js");
const { token } = require("./config.json");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    "GUILDS",
    "GUILD_MESSAGES",
    "DIRECT_MESSAGES",
  ],
  partials: ["CHANNEL"],
});

const prefix = "!";

client.once("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", (msg) => {
  console.log(msg.content);
  if (msg.content === "ping") {
    msg.reply("pong");
  }
  if (msg.content.startsWith(prefix)) {
    msg.reply("prefix");
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (commandName === "server") {
    await interaction.reply(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    );
  } else if (commandName === "user") {
    await interaction.reply("User info.");
  }
});

// Login to Discord with your client's token
client.login(token);

// 구현해야 할 기능
// 1. YouTube API랑 연동해서 노래 불러오기
// 2. LostArk API랑 연동해서 전투정보실 정보 불러오기 (HTML parsing)
