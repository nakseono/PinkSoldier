const { Client, Intents } = require("discord.js");
const { token, prefix } = require("./config.json");
const axios = require("axios");
const cheerio = require("cheerio");
const { MessageEmbed } = require("discord.js");

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
  console.log("Ready!");
});

client.on("messageCreate", async (message) => {
  const order = message.content;
  const loaOrder = order.split(" ");
  const loaInfoOrder = loaOrder[0];
  const nickname = loaOrder[1];

  //! 봇 메시지만 제외하고 콘솔에 찍는 기능.
  if (!message.author.bot) {
    console.log(order);
  }

  //! 접두사로 시작하는지 우선적으로 검사
  if (order.startsWith(prefix)) {
    if (loaInfoOrder === "!로아") {
      const loaInfo = await axios.get(
        `https://lostark.game.onstove.com/Profile/Character/${encodeURI(
          nickname
        )}`
      );

      const $ = cheerio.load(loaInfo.data);

      const userName = $(".profile-character-info__name").text(); //! 닉네임

      const userServer = $(".profile-character-info__server")
        .text()
        .replace("@", ""); //! 서버

      const userJob = $(".profile-character-info__img").attr("alt"); //! 직업

      const userGuild = $(".game-info__guild").text().replace("길드", ""); //! 길드

      const userTitle = $(".game-info__title").text().replace("칭호", ""); //! 장착중인 칭호

      const userEngrave = $(
        "div.profile-ability-engrave > div > div > ul > li > span"
      ).text(); //! 각인

      const userArea = $(".game-info__wisdom > span")
        .text()
        .replace("영지", ""); //! 영지

      const userAbility = $(".profile-ability-battle").text(); //! 특성

      const userLevel = $(".level-info2__item")
        .text()
        .replace("달성 아이템 레벨", "");

      const userBattleLevel = $(".level-info__item")
        .text()
        .replace("전투 레벨", "");

      const userGroupLevel = $(".level-info__expedition")
        .text()
        .replace("원정대 레벨", "");

      // 수집형 포인트 $(".").text().replace("", "");

      // 보유 캐릭터 리스트 $(".").text().replace("", "");

      const embedMessage = new MessageEmbed()
        .setColor("#ff3399")
        .setTitle(`${userName}`)
        .addFields(
          {
            name: "기 본 정 보",
            value: `\`서  버\` : ${userServer}\n\`클래스\` : ${userJob}\n\`길  드\` : ${userGuild}\n\`칭  호\` : ${userTitle}\n\`전  투\` : ${userBattleLevel}\n\`아이템\` : ${userLevel}\n\`원정대\` : ${userGroupLevel}\n\`영  지\` : ${userArea}`,
            inline: true,
          },
          {
            name: "\u200B",
            value: "\u200B",
            inline: true,
          },
          {
            name: "착용 장비",
            value: `test`,
            inline: true,
          }
        )
        .addFields({ name: "\u200B", value: "\u200B" })
        .addFields(
          { name: "기본 특성", value: "기본 특성", inline: true },
          { name: "\u200B", value: "\u200B", inline: true },
          { name: "각인 효과", value: "각인", inline: true }
        );

      message.channel.send({ embeds: [embedMessage] });
    }
  }
});

// 좌측에 기본정보 타이틀로,
// 서버 / 길드 / 클래스 / 칭호 / 전투레벨 / 아이템 레벨 / 원정대 레벨 / 영지 레벨
// 그 옆에 장비 리스트업 하자.
// 머리 / 어깨 / 상의 / 하의 / 장갑 / 무기 // 각인 2종류
// 그리고 아래에 특성이랑 각인 효과.
// 수집형 포인트
// 보유 캐릭터 리스트업

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
