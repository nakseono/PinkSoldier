const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

// 입력한 캐릭터 닉네임이 유효한지 아닌지 체크하고 입력한 캐릭터의 이름이 정확하지 않다는 에러메시지 보내주기.

const incomeCalc = async (username) => {
  console.log(`수입 정산 실행 - ${username}`);

  try {
    return await axios
      .get(`https://lostark.game.onstove.com/Profile/Character/${encodeURI(username)}`)
      .then(async (html) => {
        const $ = cheerio.load(html.data);

        let json = {}; // 전체 데이터가 들어갈 곳.
        let mainServer = $(`.profile-character-info__server`).text();

        count = 0;
        temp = [];

        $(".profile-character-list__char > li > span > button").each(function (
          index,
          item
        ) {
          temp[count] = $(this).attr("onclick").split("/")[3].replace("'", "");
          count = count + 1;
        });

        json["ownChar"] = temp;
        json["level"] = await callItemLevel(json, mainServer);
        json["job"] = await callCharJob(json, mainServer);

        // console.log(`ownChar : ${JSON.stringify(json["ownChar"])}`);
        // console.log(`ownChar : ${JSON.stringify(json["level"])}`);
        // console.log(`ownChar : ${JSON.stringify(json["job"])}`);

        // console.log(`json : ${JSON.stringify(json)}`);

        //! 레벨 순으로 정렬
        let list = [];

        for (let n = 0; n < json["ownChar"].length; n++) {
          let temp = { name: ``, level: ``, job: `` };
          temp[`name`] = json["ownChar"][n];
          temp[`level`] = json["level"][n];
          temp[`job`] = json["job"][n];
          list.push(temp);
        }

        //! 다른 서버의 캐릭터 제외
        let filterByLevel = (arr) => {
          if (arr.level === "anotherServer") {
            return false;
          }
          return true;
        };

        let ownList = list
          .sort((a, b) => b["level"] - a["level"])
          .filter(filterByLevel);

        //! 리팩토링 중 추가 : 순서대로 정렬된 뒤 레벨이 가장 높은 6캐릭만 남기고 삭제.

        ownList = ownList.slice(0,6);

        // console.log(`ownList : ${JSON.stringify(ownList)}`);

        let reward = countingRaidReward(ownList);

        let rewardImcomeResult =
          reward.argus * 1600 +
          reward.valtanNormal * 2500 +
          reward.valtanHard * 4500 +
          reward.biackissNormal * 2500 +
          reward.biackissHard * 4500 +
          reward.koukuSaton * 4500 +
          reward.abrelshudNormal12 * 4500 +
          reward.abrelshudNormal34 * 1500 +
          reward.abrelshudNormal56 * 2500 +
          reward.abrelshudHard12 * 5500 +
          reward.abrelshudHard34 * 2000 +
          reward.abrelshudHard56 * 3000;

        return new MessageEmbed()
          .setColor("#8B00FF")
          // .setThumbnail(`${moyahoURL}`)
          .setTitle(`${username}님의 주간 수입 정산`)
          .addFields(
            {
              name: `\`닉네임\``,
              value: `${makeNicknameList(ownList)}`,
              inline: true,
            },
            {
              name: `\`직업\``,
              value: `${makeJobList(ownList)}`,
              inline: true,
            },
            {
              name: `\`레벨\``,
              value: `${makeLevelList(ownList)}`,
              inline: true,
            },
            {
              name: `\`주간 컨텐츠\``,
              value: `
              아르고스 (~3페) [\`1600골드\`]
              발탄 노말 [\`2500골드\`]
              발탄 하드 [\`4500골드\`]
              비아키스 노말 [\`2500골드\`]
              비아키스 하드 [\`4500골드\`]
              쿠크세이튼 [\`4500골드\`]
              아브렐슈드 노말 (1,2관) [\`4500골드\`]
              아브렐슈드 노말 (3,4관) [\`1500골드\`]
              아브렐슈드 노말 (5,6관) [\`2000골드\`]
              아브렐슈드 하드 (1,2관) [\`5500골드\`]
              아브렐슈드 하드 (3,4관) [\`2000골드\`]
              아브렐슈드 하드 (5,6관) [\`3000골드\`]

            총 보상 골드 합계 : \`${rewardImcomeResult}\`
            `,
              inline: true,
            },
            {
              name: `\`해당 캐릭터 수\``,
              value: `
              :  \`${reward.argus}\` 캐릭터
              :  \`${reward.valtanNormal}\` 캐릭터
              :  \`${reward.valtanHard}\` 캐릭터
              :  \`${reward.biackissNormal}\` 캐릭터
              :  \`${reward.biackissHard}\` 캐릭터
              :  \`${reward.koukuSaton}\` 캐릭터
              :  \`${reward.abrelshudNormal12}\` 캐릭터
              :  \`${reward.abrelshudNormal34}\` 캐릭터
              :  \`${reward.abrelshudNormal56}\` 캐릭터
              :  \`${reward.abrelshudHard12}\` 캐릭터
              :  \`${reward.abrelshudHard34}\` 캐릭터
              :  \`${reward.abrelshudHard56}\` 캐릭터
            `,
              inline: true,
            },
            {
              name: `\`참 고 사 항\``,
              value: `
            - 검색한 캐릭터가 속한 서버의 캐릭터만 불러왔습니다.
            - 버스비와 \`오레하 클리어 골드\`는 포함하지 않았습니다.
            - 순수히 \`클리어했을 때 보상으로 주는 골드\`만을 계산했습니다.
            - 보유중인 각 캐릭터의 레벨을 기준으로 레벨이 가장 높은 상위 6캐릭이
            가장 상위 단계의 컨텐츠를 클리어한다고 가정한 값입니다.
            `,
            }
          );
      })
  } catch(error) {
    let now = new Date();
    console.error(`수입 정산 incomeCalc Func 에러 : ${error}`);

    fs.appendFile(
      "logs/bugLog.txt",
      `${now} || /정산 incomeCalc Func 에러 || ${error}\n`,
      (err) => {
        // console.log(err);
      }
    );
  }
}

//! 메인 서버가 아닌 캐릭터를 제외한 각 캐릭터의 레벨을 불러온다.
const callItemLevel = async (json, mainServer) => {
  let ownLevel = [];
  try {
    for (let i = 0; i < json["ownChar"].length; i++) {
      await axios
        .get(
          `https://lostark.game.onstove.com/Profile/Character/${encodeURI(
            json["ownChar"][i]
          )}`
        )
        .then((html) => {
          const $ = cheerio.load(html.data);
          if ($(`.profile-character-info__server`).text() === mainServer) {
            $(".level-info2__item > span").each(function (index, item) {
              if (index === 1) {
                ownLevel.push(
                  Number($(this).text().replace("Lv.", "").replace(",", ""))
                );
              }
            });
          } else {
            ownLevel.push("anotherServer");
          }

          // console.log(`test : ${ownLevel}`);
        });
    }
    return ownLevel;
  } catch (err) {
    let now = new Date();
    console.error(`error: ${error}`);

    fs.appendFile(
      "logs/bugLog.txt",
      `${now} || /정산 callItemLevel Func 에러 || ${error}\n`,
      (err) => {
        // console.log(err);
      }
    );
  }
};

//! 메인 서버가 아닌 캐릭터를 제외한 각 캐릭터의 레벨을 불러온다.
const callCharJob = async (json, mainServer) => {
  let ownJob = [];
  try {
    for (let k = 0; k < json["ownChar"].length; k++) {
      await axios
        .get(
          `https://lostark.game.onstove.com/Profile/Character/${encodeURI(
            json["ownChar"][k]
          )}`
        )
        .then((html) => {
          const $ = cheerio.load(html.data);
          if ($(`.profile-character-info__server`).text() === mainServer) {
            ownJob.push($(".profile-character-info__img").attr("alt"));
          } else {
            ownJob.push("anotherServer");
          }

          // console.log(`test : ${ownJob}`);
        });
    }
    return ownJob;
  } catch (err) {
    console.error(`error: ${error}`);

    fs.appendFile(
      "logs/bugLog.txt",
      `${now} || /정산 callCharJob Func 에러 || ${error}\n`,
      (err) => {
        // console.log(err);
      }
    );
  }
};

const countingRaidReward = (list) => {
  const result = {
    argus: 0,
    valtanNormal: 0,
    valtanHard: 0,
    biackissNormal: 0,
    biackissHard: 0,
    koukuSaton: 0,
    abrelshudNormal12: 0,
    abrelshudNormal34: 0,
    abrelshudNormal56: 0,
    abrelshudHard12: 0,
    abrelshudHard34: 0,
    abrelshudHard56: 0,
  };

  for (let i = 0; i < list.length; i++) {
    let char = list[i]["level"];
    if (char >= 1370) {
      result.argus++;
    }
    if (char >= 1415) {
      result.valtanNormal++;
      result.orehaHard--;
    }
    if (char >= 1430) {
      result.biackissNormal++;
    }
    if (char >= 1445) {
      result.valtanHard++;
      result.valtanNormal--;
    }
    if (char >= 1460) {
      result.biackissHard++;
      result.biackissNormal--;
    }
    if (char >= 1475) {
      result.koukuSaton++;
      result.argus--;
    }
    if (char >= 1490) {
      result.biackissHard--;
      result.abrelshudNormal12++;
    }
    if (char >= 1500) {
      result.abrelshudNormal34++;
    }
    if (char >= 1520) {
      result.abrelshudNormal56++;
    }
    if (char >= 1540) {
      result.abrelshudNormal12--;
      result.abrelshudHard12++;
    }
    if (char >= 1550) {
      result.abrelshudNormal34--;
      result.abrelshudHard34++;
    }
    if (char >= 1560) {
      result.abrelshudNormal56--;
      result.abrelshudHard56++;
    }
  }

  // console.log(`raidReward : ${JSON.stringify(result)}`);
  return result;
};

const makeNicknameList = (list) => {
  let temp = [];
  for (let i = 0; i < list.length; i++) {
    temp.push(`${i + 1}. ${list[i]["name"]}\n`);
  }
  return temp.join("");
};

const makeJobList = (list) => {
  let temp = [];
  for (let i = 0; i < list.length; i++) {
    temp.push(`${list[i]["job"]}\n`);
  }
  return temp.join("");
};

const makeLevelList = (list) => {
  let temp = [];
  for (let i = 0; i < list.length; i++) {
    temp.push(`${list[i]["level"]}\n`);
  }
  return temp.join("");
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('정산')
		.setDescription('test')
    .addStringOption(option =>
      option.setName('닉네임') //! 옵션 이름에는 공백이 들어가면 안된다. 에러 발생함.
        .setDescription('test')
        .setRequired(true)),
	async execute(interaction) {
    let now = new Date();
    let username = (JSON.stringify(interaction.options._hoistedOptions[0]["value"])).replace(/\"/gi, "");

    // const errorEmbedMessage = new MessageEmbed()
    //   .setColor("#8B00FF")
    //   .setTitle(`에러가 발생했습니다!`)
    //   .setDescription(
    //     `아마도 숫자가 아닌 문자를 입력하신 것 같아요!\n그게 아니라면 올바른 명령을 요청했는지 \`/명령어\` 를 통해 다시 한번 용례를 확인해주시고,\n에러가 지속된다면 개발자에게 문의해주세요.`
    //   );

    try {
      fs.appendFile(
        "logs/useLog.txt",
        `${now} || /정산 ${username}\n`,
        (err) => {
          // console.log(`정산 에러 : ${err}`);
        }
      );

      await interaction.deferReply();

      let resultEmbed = await incomeCalc(username);
      // console.log(`result : ${JSON.stringify(resultEmbed)}`);

      if(resultEmbed !== "") {
        await interaction.editReply({ embeds: [resultEmbed] });
      }

    } catch(error) {
      console.error(`error: ${error}`)

      fs.appendFile(
        "logs/bugLog.txt",
        `${now} || /정산 ${username} || ${error}\n`,
        (err) => {
          // console.log(`정산 에러 : ${err}`);
        }
      );
    }

	},
};