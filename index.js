const { Client, Intents } = require("discord.js");
const { token, prefix } = require("./config.json");
const axios = require("axios");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    "GUILDS",
    "GUILD_MESSAGES",
    "DIRECT_MESSAGES",
  ],
  partials: ["CHANNEL"],
});

client.once("ready", () => {
  console.log("핑크솔져 ON");
});

client.on("messageCreate", async (message) => {
  const order = message.content;
  const loaOrder = order.split(" ")[0];
  const nickname = loaOrder[1];

  // 봇 메시지만 제외하고 콘솔에 찍는 기능.
  if (!message.author.bot) {
    console.log(order);
  }

  // 접두사로 시작하는지 우선적으로 검사
  if (order.startsWith(prefix)) {
    if (loaOrder === "!로아") {
      let encodedNick = encodeURI(nickname);
      const loaInfo = await axios.get(
        `https://lostark.game.onstove.com/Profile/Character/${encodedNick}`
      );

      console.log(loaInfo);
    }
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
