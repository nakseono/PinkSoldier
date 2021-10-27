const { Client, Intents } = require("discord.js");
const { token, prefix } = require("./config.json");
const { MessageEmbed } = require("discord.js");
const loaInfo = require("./lostark/loaInfo.js");
const classImage = require("./lostark/classImage.json");

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
  const order = message.content.split(" ")[0];
  const orderWithOutPrefix = message.content.split(" ")[1];

  //! 봇 메시지만 제외하고 콘솔에 찍는 기능.
  if (!message.author.bot) {
    console.log(message.data);
  }

  //! 봇 메시지가 아니며, 접두사로 시작하는지 우선적으로 검사
  //! 이후 각 명령어에 따라서 각기 다른 결과 출력
  if (!message.author.bot) {
    if (order === `${prefix}정보`) {
      loaInfo.getUserInfo(orderWithOutPrefix).then((data) => {
        const embed = createLoaInfoEmbed(orderWithOutPrefix, data);

        message.channel.send({ embeds: [embed] });
      });
    }

    if (order === `${prefix}경매`) {
      const embed = createAuctionEmbed(orderWithOutPrefix);
      message.channel.send({ embeds: [embed] });
    }
  }

  //! --------------------------------------------------------

  function createAuctionEmbed(value) {
    const people4 = Math.floor(value * 0.95 * (3 / 4));
    const people8 = Math.floor(value * 0.95 * (7 / 8));

    const embedMessage = new MessageEmbed()
      .setColor("#ff3399")
      .setTitle(`경매 분배금 계산 - ${value}골드`)
      .addFields(
        {
          name: `4인 기준`,
          value: `\`${people4}\` 골드 입찰!`,
          // inline: true,
        },
        {
          name: "8인 기준",
          value: `\`${people8}\` 골드 입찰!`,
          // inline: true,
        }
      );

    return embedMessage;
  }

  const createLoaInfoEmbed = (userName, data) => {
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

    //? ------- 종합해서 임베드 만들기 -------

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

//? DONE
//? - 로스트아크 전투정보실 DATA
//? - 경매 최적가 계산기 (~골보다 싸면 입찰)

//? 진행 중 기능

//? 구현해야 할 기능
//? - 로스트아크 일정표에 맞춰서 모험섬, 카오스게이트 등 알림기능
//? - 보유 캐릭터 목록 표시해서 주간 수입 보상 합계
//? - 각 군단장 보상 및 더보기 비용 등. : 참고링크 - https://www.inven.co.kr/board/lostark/4821/83355
//? - 더 많은 정보를 원한다면? - 로아와 링크 걸기.
//! 코드 리팩토링 및 스플릿

//? +@
//? YouTube API 연동해서 노래 기능까지 추가

//? 할까?
//? xlsx 모듈 이용해서 수요눕클회 스프레트 시트에서 일정 안 만진사람 알림가도록 - 스프레드 시트 이제 눕클회에서 안 쓰일 것 같은데...
