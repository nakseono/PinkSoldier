const { MessageEmbed } = require("discord.js");
const classImage = require("../classImage.json");

const createLoaInfoEmbed = (userName, data, message) => {
  // console.log(`임베드 메시지 : ${JSON.stringify(data)}`);

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
        value: `\u200B`,
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

  message.channel.send({ embeds: [embedMessage] });
};

const createLoawaLinkEmbed = (userName, message) => {
  const embedMessage = new MessageEmbed().setColor("#ff3399").addFields({
    name: `링크 클릭시 로아와 페이지로 이동합니다.`,
    value: `https://loawa.com/char/${userName}`,
  });

  message.channel.send({ embeds: [embedMessage] });
};

module.exports = { createLoaInfoEmbed, createLoawaLinkEmbed };
