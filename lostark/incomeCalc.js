const axios = require("axios");
const cheerio = require("cheerio");
const { MessageEmbed } = require("discord.js");
const fs = require("fs");

const incomeCalc = async (message, userName, errorMessage) => {
  // console.log(`수입 정산 실행 - ${userName}`);
  axios
    .get(
      `https://lostark.game.onstove.com/Profile/Character/${encodeURI(
        userName
      )}`
    )
    .then(async (html) => {
      const $ = cheerio.load(html.data);
      let json = {}; // 전체 데이터가 들어갈 곳
      let mainServer = $(`.profile-character-info__server`).text();

      //! 캐릭터 닉네임 가져옴
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

      // console.log(`ownChar : ${JSON.stringify(json)}`);

      json["level"] = await callItemLevel(json, mainServer, errorMessage);

      json["job"] = await callCharJob(json, mainServer, errorMessage);

      // console.log(`json : ${JSON.stringify(json)}`);

      //! 아래는 리스트를 레벨 순으로, 그리고 다른 서버의 캐릭터들은 제외하는 로직

      let list = [];

      for (let n = 0; n < json["ownChar"].length; n++) {
        let temp = { name: ``, level: ``, job: `` };
        temp[`name`] = json["ownChar"][n];
        temp[`level`] = json["level"][n];
        temp[`job`] = json["job"][n];
        list.push(temp);
      }

      let filterByLevel = (arr) => {
        if (arr.level === "anotherServer") {
          return false;
        }
        return true;
      };

      let ownList = list
        .sort((a, b) => b["level"] - a["level"])
        .filter(filterByLevel);

      // console.log(`ownList : ${JSON.stringify(ownList)}`);

      //! 레이드 보상 리스트업
      let reward = countingRaidReward(ownList);

      let rewardImcomeResult =
        reward.koukuSaton * 4500 +
        reward.biackissHard * 4500 +
        reward.valtanHard * 4500 +
        reward.biackissNormal * 3300 +
        reward.valtanNormal * 3300 +
        reward.argus * 3300 +
        reward.orehaHard * 1700 +
        reward.orehaNormal * 1500;

      //! 총 임베드 메시지 생성
      try {
        const embedMessage = new MessageEmbed()
          .setColor("#ff3399")
          // .setThumbnail(`${moyahoURL}`)
          .setTitle(`${userName}님의 주간 수입 정산`)
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
            쿠크세이튼 [\`4500골드\`] 
            비아키스 하드 [\`4500골드\`]
            발탄 하드 [\`4500골드\`]
            비아키스 노말 [\`3300골드\`]
            발탄 노말 [\`3300골드\`]
            아르고스 (~3페) [\`3300골드\`]
            오레하 하드 [\`1700골드\`]
            오레하 노말 [\`1500골드\`]

            총 보상 골드 합계 : \`${rewardImcomeResult}\`
            `,
              inline: true,
            },
            {
              name: `\`해당 캐릭터 수\``,
              value: `
            :  \`${reward.koukuSaton}\` 캐릭터
            :  \`${reward.biackissHard}\` 캐릭터
            :  \`${reward.valtanHard}\` 캐릭터
            :  \`${reward.biackissNormal}\` 캐릭터
            :  \`${reward.valtanNormal}\` 캐릭터
            :  \`${reward.argus}\` 캐릭터
            :  \`${reward.orehaHard}\` 캐릭터
            :  \`${reward.orehaNormal}\` 캐릭터
            `,
              inline: true,
            },
            {
              name: `\`참 고 사 항\``,
              value: `
            - 검색한 캐릭터가 속한 서버의 캐릭터만 불러왔습니다.
            - 버스비는 포함하지 않았습니다.
            - 순수히 \'클리어했을 때 보상으로 주는 골드\'만을 계산했습니다.
            - 보유중인 각 캐릭터의 레벨을 기준으로
              가장 상위 단계의 컨텐츠를 클리어한다고 가정한 값입니다.
            - 아브렐슈드는 개인별 편차가 커 계산에 포함되지 않습니다.
            (1475 쿠크세이튼까지 수행한 것과 똑같이 계산했습니다.)
            `,
            }
          );
        const already = await message.channel.messages.fetch({ limit: 1 });

        message.channel.bulkDelete(already);
        message.channel.send({ embeds: [embedMessage] });
      } catch (err) {
        const already = await message.channel.messages.fetch({ limit: 1 });

        message.channel.bulkDelete(already);

        message.channel.send({ embeds: [errorMessage] });

        // 에러 메시지 기록 할 것 : 일시, 어떤 입력을 했는지 -> userName, 무슨 에러가 발생했는지
        let now = new Date();

        fs.appendFile(
          "bugLog.txt",
          `${now} / !정산 ${userName} / ${err}\n`,
          (err) => {
            // console.log(`정산 에러 : ${err}`);
          }
        );
      }
    });
};

const callItemLevel = async (json, mainServer, errorMessage) => {
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
    // 에러 메시지 출력
    const already = await message.channel.messages.fetch({ limit: 1 });

    message.channel.bulkDelete(already);

    message.channel.send({ embeds: [errorMessage] });

    // 에러 메시지 기록 할 것 : 일시, 어떤 입력을 했는지 -> userName, 무슨 에러가 발생했는지
    let now = new Date();

    fs.appendFile("bugLog.txt", `${now} / !정산 ${userName} / ${err}\n`);
  }
};

const callCharJob = async (json, mainServer, errorMessage) => {
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
    // 에러 메시지 출력
    const already = await message.channel.messages.fetch({ limit: 1 });

    message.channel.bulkDelete(already);

    message.channel.send({ embeds: [errorMessage] });

    // 에러 메시지 기록 할 것 : 일시, 어떤 입력을 했는지 -> userName, 무슨 에러가 발생했는지
    let now = new Date();

    fs.appendFile("bugLog.txt", `${now} / !정산 ${userName} / ${err}\n`);
  }
};

//! <->

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

const countingRaidReward = (list) => {
  const result = {
    orehaNormal: 0,
    orehaHard: 0,
    argus: 0,
    valtanNormal: 0,
    valtanHard: 0,
    biackissNormal: 0,
    biackissHard: 0,
    koukuSaton: 0,
  };

  for (let i = 0; i < list.length; i++) {
    let char = list[i]["level"];
    if (char >= 1325) {
      result.orehaNormal++;
    }
    if (char >= 1355) {
      result.orehaHard++;
      result.orehaNormal--;
    }
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
  }

  // console.log(`raidReward : ${JSON.stringify(result)}`);
  return result;
};

module.exports = { incomeCalc };
