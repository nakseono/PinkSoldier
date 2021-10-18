const { Client, Intents } = require("discord.js");
const { token, prefix } = require("./config.json");
const axios = require("axios");
const cheerio = require("cheerio");
const { MessageEmbed } = require("discord.js");
const lostArk = require("./lostArk.js");

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
  console.log("핑크솔져 준비 완료");
});

client.on("messageCreate", async (message) => {
  const order = message.data;
  const loaOrder = message.content.split(" ");
  const loaInfoOrder = loaOrder[0];

  //! 봇 메시지만 제외하고 콘솔에 찍는 기능.
  if (!message.author.bot) {
    console.log(order);
  }

  //! 봇 메시지가 아니며, 접두사로 시작하는지 우선적으로 검사
  if (!message.author.bot) {
    if (loaInfoOrder === "!로아") {
      const nickname = loaOrder[1];
      const userData = lostArk.getUserInfo(nickname);
      console.log("index.js");
      console.log(userData);
      // message.channel.send(`치명 : ${userData["ability"][1]}`);
      // message.channel.send(data[0]);
    }
  }

  //! --------------------------------------------------------

  const createLoaEmbed = (userName, data) => {};

  // if (order.startsWith(prefix)) {
  //   if (loaInfoOrder === "!로아") {
  //     const loaInfo = await axios.get(
  //       `https://lostark.game.onstove.com/Profile/Character/${encodeURI(
  //         nickname
  //       )}`
  //     );

  //     const embedMessage = new MessageEmbed()
  //       .setColor("#ff3399")
  //       .setTitle(`${userName}`)
  //       .addFields(
  //         {
  //           name: "기본 정보",
  //           value: `\`서  버\` : ${userServer}\n\`클래스\` : ${userJob}\n\`길  드\` : ${userGuild}\n\`칭  호\` : ${userTitle}\n\`전  투\` : ${userBattleLevel}\n\`아이템\` : ${userLevel}\n\`원정대\` : ${userGroupLevel}\n\`영  지\` : ${userArea}`,
  //           inline: true,
  //         },
  //         {
  //           name: "\u200B",
  //           value: "\u200B",
  //           inline: true,
  //         },
  //         {
  //           name: "착용 장비",
  //           value: `test`,
  //           inline: true,
  //         }
  //       );

  //     message.channel.send({ embeds: [embedMessage] });
  //   }
  // }
});

// Login to Discord with your client's token
client.login(token);

//? 구현해야 할 기능
//? 1. 로스트아크 전투정보실 DATA
//? 2. YouTube API 연동해서 노래 기능까지 추가
//? 3. 로스트아크 일정표에 맞춰서 모험섬, 카오스게이트 등 알림기능
//? 4. xlsx 모듈 이용해서 수요눕클회 스프레트 시트에서 일정 안 만진사람 알림가도록
