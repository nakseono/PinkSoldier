const { Client, Intents } = require("discord.js");
const { token, prefix } = require("./config.json");
const { MessageEmbed } = require("discord.js");
const lostArk = require("./lostArk.js");
const classImage = require("./classImage.json");

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
      const userName = loaOrder[1];
      lostArk.getUserInfo(userName).then((data) => {
        const embed = createLoaEmbed(userName, data);
        // console.log(`embed: ${embed}`);

        message.channel.send({ embeds: [embed] });
      });
    }
  }

  //! --------------------------------------------------------

  const createLoaEmbed = (userName, data) => {
    //? ------- 기본 특성 정보 가공 -------

    let basicAbilityBody = "";

    for (let p = 1; p < data["basic-ability"].length; p++) {
      if ((p = 1)) {
        basicAbilityBody += `\`공격력\`: ${data["basic-ability"][p]}\n`;
      }
      if ((p = 3)) {
        basicAbilityBody += `\`생명력\`: ${data["basic-ability"][p]}\n`;
      }
    }

    //? ------- 전투 특성 정보 가공 -------

    let abilityBody = "";

    for (let i = 1; i < data["ability"].length; i++) {
      if ((i = 1)) {
        abilityBody += `\`치  명\` : ${data["ability"][i]}\n`;
      }
      if ((i = 3)) {
        abilityBody += `\`특  화\` : ${data["ability"][i]}\n`;
      }
      if ((i = 5)) {
        abilityBody += `\`제  압\` : ${data["ability"][i]}\n`;
      }
      if ((i = 7)) {
        abilityBody += `\`신  속\` : ${data["ability"][i]}\n`;
      }
      if ((i = 9)) {
        abilityBody += `\`인  내\` : ${data["ability"][i]}\n`;
      }
      if ((i = 11)) {
        abilityBody += `\`숙  련\` : ${data["ability"][i]}\n`;
      }
    }

    //? ------- 각인 정보 가공 -------

    let engraveBody = "";

    for (let k = 0; k < data["engrave"].length; k++) {
      engraveBody += `${data["engrave"][k]}\n`;
    }

    //? ------- 썸네일 정보 가공 -------

    let thumbnailURL = "";

    for (let l = 0; l < classImage["job_images"].length; l++) {
      if (classImage["job_images"][l][`jobName`] === data["job"]) {
        thumbnailURL = classImage["job_images"][l]["imgSrc"];
      }
    }

    const embedMessage = new MessageEmbed()
      .setColor("#ff3399")
      .setTitle(`${userName}`)
      .setThumbnail(`${thumbnailURL}`)
      .addFields(
        {
          name: "기본 정보",
          value: `\`서  버\` : ${data["server"]}\n\`클래스\` : ${data["job"]}\n\`길  드\` : ${data["guild"]}\n\`칭  호\` : ${data["title"]}`,
          inline: true,
        },
        {
          name: "레벨 정보",
          value: `\`전  투\` : ${data["level"]}\n\`아이템\` : ${data["itemLevel"]}\n\`원정대\` : ${data["userGroupLevel"]}\n\`영  지\` : ${data["garden_level"]}`,
          inline: true,
        },
        {
          name: "\u200B",
          value: "\u200B",
          inline: true,
        }
      )

      .addFields({
        name: "\u200B",
        value: "\u200B",
      })

      .addFields(
        {
          name: "기본 특성",
          value: `${basicAbilityBody}`,
          inline: true,
        },
        { name: "전투 특성", value: `${abilityBody}`, inline: true },
        {
          name: "각인 정보",
          value: `${engraveBody}`,
          inline: true,
        }
      );

    return embedMessage;
  };
});

client.login(token);

//? 구현해야 할 기능
//? 1. 로스트아크 전투정보실 DATA
//? 2. YouTube API 연동해서 노래 기능까지 추가
//? 3. 로스트아크 일정표에 맞춰서 모험섬, 카오스게이트 등 알림기능
//? 4. xlsx 모듈 이용해서 수요눕클회 스프레트 시트에서 일정 안 만진사람 알림가도록
