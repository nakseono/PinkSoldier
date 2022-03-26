const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

const classImage = require("./classImage.json");

const getUserInfo = (userName) => {
  // console.log(`loaInfoData.js - getUserInfo 실행 : ${userName}`);

  return axios
    .get(
      `https://lostark.game.onstove.com/Profile/Character/${encodeURI(
        userName
      )}`
    )
    .then((html) => {
      const $ = cheerio.load(html.data);
      let json = {};

      if ($(`.profile-character-info__name`).text()) {
        //! <-- 기본 정보 -->

        json["userName"] = $(`.profile-character-info__name`).text(); // 닉네임

        json["server"] = $(`.profile-character-info__server`)
          .text()
          .replace("@", ""); // 서버명

        json["job"] = $(".profile-character-info__img").attr("alt"); // 직업명

        json["guild"] = $(".game-info__guild").text().replace("길드", ""); // 길드명

        json["title"] = $(".game-info__title").text().replace("칭호", ""); // 장착중인 칭호

        json["level"] = $(".level-info__item").text().replace("전투 레벨", ""); // 전투 레벨

        $(".level-info2__item > span").each(function (index, item) {
          if (index === 1) json["itemLevel"] = $(this).text();
        }); // 아이템 레벨

        json["userGroupLevel"] = $(".level-info__expedition")
          .text()
          .replace("원정대 레벨", ""); // 원정대 레벨

        $("div.game-info__wisdom")
          .children()
          .each(function (index, item) {
            if (index === 1) json["garden_level"] = $(this).text();
            // 영지 레벨
            else if (index === 2) json["garden_name"] = $(this).text(); // 영지 이름
          });

        //! <-- 착용 장비 --> <보류>

        // let equip = $(
        //   "#profile-ability.lui-tab__content.profile-ability > script"
        // )[0].children[0].data;

        //! <-- 기본 특성 정보 -->

        let count = 0;
        let temp = [];

        $(".profile-ability-basic > ul > li")
          .children()
          .each(function (index, item) {
            if ($(this).attr("class") !== "profile-ability-tooltip") {
              if ($(this).text() !== undefined) {
                temp[count] = $(this).text();
                count = count + 1;
              }
            }
          });

        json["basic-ability"] = temp;

        //! <-- 전투 특성 정보 -->

        count = 0;
        temp = [];

        $(".profile-ability-battle > ul > li")
          .children()
          .each(function (index, item) {
            if ($(this).attr("class") !== "profile-ability-tooltip") {
              if ($(this).text() !== undefined) {
                temp[count] = $(this).text();
                count = count + 1;
              }
            }
          });

        json["ability"] = temp;

        //! <<- 각인 효과 ->>

        count = 0;
        temp = [];

        $(".profile-ability-engrave > div > div > ul > li > span").each(function (
          index,
          item
        ) {
          temp[count] = $(this).text();
          count = count + 1;
        });

        json["engrave"] = temp;

        // console.log(`json data : ${JSON.stringify(json)}`)
      } else {
        json = "notExistUser"
      }
      // console.log(json);
      return json;
    });
};

const createLoaInfoEmbed = async (userName, data) => {
  // console.log(`임베드 메시지 : ${JSON.stringify(data)}`);
  let embedMessage;

  if(data === "notExistUser" || data["itemLevel"] === "Lv.0.00"){
    embedMessage = new MessageEmbed()
      .setColor("#ff3399")
      .setTitle(`오류가 발생했습니다!`)
      .setDescription(
        `정보를 찾을 수 없습니다.\n입력한 닉네임이 정확한지 확인해주세요.\n또는 해당 캐릭터의 레벨이 너무 낮아 표기가 안될 수 있습니다.`
      );
  } else {
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

    embedMessage = new MessageEmbed()
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
  }
  // console.log(`test: ${embedMessage}`);
  return embedMessage; // 종합해서 embedMessage return.
};


module.exports = {
	data: new SlashCommandBuilder()
		.setName('정보')
		.setDescription('입력한 [닉네임] 에 대한 로아 정보를 출력합니다.')
    .addStringOption(option =>
      option.setName('닉네임') //! 옵션 이름에는 공백이 들어가면 안된다. 에러 발생함.
        .setDescription('검색할 닉네임입니다.')
        .setRequired(true)),
	async execute(interaction) {
    let userNickName = (JSON.stringify(interaction.options._hoistedOptions[0]["value"])).replace(/\"/gi, "");
    let now = new Date();

    try {
      let userData = await getUserInfo(userNickName)
      let returnEmbed = await (createLoaInfoEmbed(userNickName, userData));
      await interaction.reply({ embeds: [returnEmbed] });

      fs.appendFile(
        "logs/useLog.txt",
        `${now} || /정보 ${userNickName}\n`,
        (error) => {
          // console.error(`정보 로그 남길 때 에러 발생 : ${error}`);
        }
      );

    } catch(error) {
      // 에러 메시지 기록 할 것 : 일시, 어떤 입력을 했는지 -> userName, 무슨 에러가 발생했는지

      fs.appendFile(
        "logs/bugLog.txt",
        `${now} || /정보 ${userNickName} || ${error}\n`,
        (err) => {
          // console.error(`정보 에러 : ${err}`);
        }
      );

      console.error(`정보 에러 : ${error}`)
    }
	}
};

