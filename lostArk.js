const axios = require("axios");
const cheerio = require("cheerio");

const getHTML = (url) => {
  axios.get(url);
};

const getUserInfo = (userName) => {
  console.log(`getUserInfo 실행 : ${userName}`);

  axios
    .get(
      `https://lostark.game.onstove.com/Profile/Character/${encodeURI(
        userName
      )}`
    )
    .then((html) => {
      const $ = cheerio.load(html.data);

      let json = {};

      //? <-- 기본 정보 -->

      json["userName"] = $(`.profile-character-info__name`).text(); //! 닉네임

      json["server"] = $(`.profile-character-info__server`)
        .text()
        .replace("@", ""); //! 서버명

      json["job"] = $(".profile-character-info__img").attr("alt"); //! 직업명

      json["guild"] = $(".game-info__guild").text().replace("길드", ""); //! 길드명

      json["title"] = $(".game-info__title").text().replace("칭호", ""); //! 장착중인 칭호

      json["level"] = $(".level-info__item").text().replace("전투 레벨", ""); //! 전투 레벨

      $(".level-info2__item > span").each(function (index, item) {
        if (index === 1) json["itemLevel"] = $(this).text();
      }); //! 아이템 레벨

      const userGroupLevel = $(".level-info__expedition")
        .text()
        .replace("원정대 레벨", ""); //! 원정대 레벨

      $("div.game-info__wisdom")
        .children()
        .each(function (index, item) {
          if (index === 1) json["garden_level"] = $(this).text();
          //! 영지 레벨
          else if (index === 2) json["garden_name"] = $(this).text(); //! 영지 레벨
        });

      //? <-- 착용 장비 -->

      //? <-- 특성 정보 -->

      let count = 0;
      let temp = [];
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

      //? <<- 각인 효과 ->>

      //? <<- 보유 캐릭터 정보 ->>

      console.log(json);
      return json;
    });
};

module.exports = { getUserInfo };
