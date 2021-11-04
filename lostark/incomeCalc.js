const axios = require("axios");
const cheerio = require("cheerio");
const { MessageEmbed } = require("discord.js");

const incomeCalc = (message, userName) => {
  axios
    .get(
      `https://lostark.game.onstove.com/Profile/Character/${encodeURI(
        userName
      )}`
    )
    .then(async (html) => {
      const $ = cheerio.load(html.data);
      let json = {}; // 전체 데이터가 들어갈 곳

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

      json["level"] = await callItemLevel(json);

      json["job"] = await callCharJob(json);

      // console.log(`json : ${JSON.stringify(json)}`);

      const embedMessage = new MessageEmbed()
        .setColor("#ff3399")
        .setTitle(`${userName}의 주간 수입 정산`)
        .addFields({
          name: `보유 캐릭터 목록`,
          value: `${makeCharListEmbed(json)}`,
        });
      //TODO : 직업 / 레벨 / 캐릭터 이름
      //TODO : 레이드 해당 숫자 카운팅
      //TODO : 주간 총 정산
      //TODO : 유의사항 기록

      message.channel.send({ embeds: [embedMessage] });
    });
};

const callItemLevel = async (json) => {
  let ownLevel = [];
  for (let i = 0; i < json["ownChar"].length; i++) {
    await axios
      .get(
        `https://lostark.game.onstove.com/Profile/Character/${encodeURI(
          json["ownChar"][i]
        )}`
      )
      .then((html) => {
        const $ = cheerio.load(html.data);

        $(".level-info2__item > span").each(function (index, item) {
          if (index === 1) {
            ownLevel[i] = $(this).text();
          }
        });

        // console.log(`test : ${ownLevel}`);
      });
  }
  return ownLevel;
};

const callCharJob = async (json) => {
  let ownJob = [];
  for (let k = 0; k < json["ownChar"].length; k++) {
    await axios
      .get(
        `https://lostark.game.onstove.com/Profile/Character/${encodeURI(
          json["ownChar"][k]
        )}`
      )
      .then((html) => {
        const $ = cheerio.load(html.data);

        ownJob[k] = $(".profile-character-info__img").attr("alt");

        // console.log(`test : ${ownJob}`);
      });
  }
  return ownJob;
};

const makeCharListEmbed = (json) => {
  let list = [];
  for (let j = 0; j < json["ownChar"].length; j++) {
    //TODO : 번호 / 직업 / 레벨 / 캐릭터 이름
    //ex) 1. 배틀마스터 | 1465 | 낙서노
    list.push(
      `${j + 1}. ${json["job"][j]} | ${json["level"][j]} | ${
        json["ownChar"][j]
      }\n`
    );
  }
  return list.join("");
};

module.exports = { incomeCalc };
