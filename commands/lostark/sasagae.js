const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

const sasagaeUserSearch = async (username, interaction) => {
  if(!username.includes("/")){ // 사사게 개인 검색일 경우.
    try {
      return await axios
        .get(
          `https://lostark.game.onstove.com/Profile/Character/${encodeURI(username)}`
        )
        .then(async (html) => {
          const $ = cheerio.load(html.data);

          if ($(`.profile-character-info__name`).text()) { // 현재 검색한 캐릭터가 존재하는지 아닌지 검색해보고 있다면 진행
            return await axios
              .get(`https://www.inven.co.kr/board/lostark/5355?query=list&p=1&sterm=&name=subjcont&keyword=${encodeURI(username)}`)
              .then((html) => {
                const $ = cheerio.load(html.data);

                let count = 0;
                let temp = [];
                let list = [];

                $("td.tit > div > div")
                  .children()
                  .each(function (index, item) {
                    if ($(this).attr("class") !== "category") {
                      if (
                        $(this).text() !== undefined &&
                        $(this).text() !== "" &&
                        !$(this).text().includes("이용규칙")
                      ) {
                        temp[count] = $(this).text().trim().split(`\n`);
                        count = count + 1;
                      }
                    }
                  });

                  for (let i = 0; i < temp.length; i++) {
                    list.push(temp[i][1].trim());
                  }

                  // console.log(`글 리스트 : ${list}`);

                  count = 0;
                  temp = [];

                  $("td.tit > div > div")
                    .children()
                    .each(function (index, item) {
                      if ($(this).attr("class") === "subject-link") {
                        if (
                          $(this).text() !== undefined &&
                          $(this).text() !== "" &&
                          !$(this).text().includes("이용규칙")
                        ) {
                          temp[count] = $(this).attr("href");
                          count = count + 1;
                        }
                      }
                    });

                  let links = temp;

                  let arr = [];

                  for (let k = 0; k < links.length; k++) {
                    if (list[k] !== undefined) {
                      arr.push(`[${list[k]}](${links[k]})`);
                    }
                  }

                  // console.log(`글 링크 : ${arr}`);

                  // console.log(`링크 길이 : ${arr.length}`);

                  let resultEmbed;

                  if(arr.length === 0) {
                    // console.log("사사게 분기 - 검색결과 없음");

                    resultEmbed = new MessageEmbed()
                    .setColor("#8B00FF")
                    .setTitle(`${username} 에 대한 사사게 검색 결과입니다.`)
                    .addFields(
                      {
                        name: `\`검 색 결 과\``,
                        value: `검색 결과가 존재하지 않습니다!`,
                      },
                      {
                        name: `\`참 고 사 항\``,
                        value: `- 사건/사고 게시판에서 제목+내용 으로 검색한 결과입니다.
                    - 게시글 1만개 단위로 검색됩니다.
                    - 더 자세한 내용은 인벤 사건/사고 게시판을 이용해주시길 바랍니다.`,
                      }
                    );
                  } else if (arr.length < 3) {
                    // console.log("사사게 분기 - 3개 미만");

                    resultEmbed = new MessageEmbed()
                    .setColor("#8B00FF")
                    .setTitle(`${username} 에 대한 사사게 검색 결과입니다.`)
                    .addFields(
                      {
                        name: `\`검 색 결 과\``,
                        value: arr.join(`\n`),
                      },
                      {
                        name: `\`참 고 사 항\``,
                        value: `- 사건/사고 게시판에서 제목+내용 으로 검색한 결과입니다.
                    - 게시글 1만개 단위로 검색됩니다.
                    - 더 자세한 내용은 인벤 사건/사고 게시판을 이용해주시길 바랍니다.`,
                      }
                    );
                  } else {
                    // console.log("사사게 분기 - 3개 이상");

                    resultEmbed = new MessageEmbed()
                    .setColor("#8B00FF")
                    .setTitle(`${username} 에 대한 사사게 검색 결과입니다.`)
                    .addFields(
                      {
                        name: `\`검 색 결 과\``,
                        value: arr.slice(3).join(`\n`),
                      },
                      {
                        name: `\`참 고 사 항\``,
                        value: `- 사건/사고 게시판에서 제목+내용 으로 검색한 결과입니다.
                    - 게시글 1만개 단위로 검색됩니다.
                    - 더 자세한 내용은 인벤 사건/사고 게시판을 이용해주시길 바랍니다.`,
                      }
                    );
                  }

                  interaction.editReply({ embeds: [resultEmbed] });
                }
              )
          } else { // 개인 검색 중 없는 경우.
            resultEmbed = new MessageEmbed()
            .setColor("#8B00FF")
            .setTitle(`오류가 발생했습니다!`)
            .setDescription(
              `정보를 찾을 수 없습니다.\n입력한 닉네임이 정확한지 확인해주세요.`
            );

            interaction.editReply({ embeds: [resultEmbed] });
          }
        }
      )
    } catch (error) {
      console.error(`사사게 개인 검색 중 에러 발생 : ${error}`);

      fs.appendFile(
        "logs/bugLog.txt",
        `${now} || /사사게 개인 검색 ${username}\n || ${error}`,
        (error) => {
          // console.error(`사사게 로그 남길 때 에러 발생 : ${error}`);
        }
      );
    }
  } else { // 사사게 단체 검색 ex) "김낙서/김낙떠/낙서노"
    try {
      let searchGroup = username.split("/");
      // searchGroup = ["김낙서","김낙떠","낙서노"]

      // console.log(`splitUserName : ${searchGroup}`);

      let sumObj = {};
      let linkList = [];
      let userNameList = [];
      let errorUserName = [];

      for(let i = 0; i < searchGroup.length; i++){
        await axios
          .get(`https://lostark.game.onstove.com/Profile/Character/${encodeURI(searchGroup[i])}`)
          .then(async (html) => {
            const $ = cheerio.load(html.data);

            if ($(`.profile-character-info__name`).text()) { // 현재 검색한 캐릭터가 존재하는지 아닌지 검색해보고 있다면 진행
              return await axios
                .get(`https://www.inven.co.kr/board/lostark/5355?query=list&p=1&sterm=&name=subjcont&keyword=${encodeURI(searchGroup[i])}`)
                .then(async (html) => {
                  const $ = cheerio.load(html.data);

                  let count = 0;
                  let temp = [];
                  let list = [];

                  $("td.tit > div > div")
                    .children()
                    .each(function (index, item) {
                      if ($(this).attr("class") !== "category") {
                        if (
                          $(this).text() !== undefined &&
                          $(this).text() !== "" &&
                          !$(this).text().includes("이용규칙")
                        ) {
                          temp[count] = $(this).text().trim().split(`\n`);
                          count = count + 1;
                        }
                      }
                    });

                  for (let i = 0; i < temp.length; i++) {
                    list.push(temp[i][1].trim());
                  }

                  count = 0;
                  temp = [];

                  $("td.tit > div > div")
                    .children()
                    .each(function (index, item) {
                      if ($(this).attr("class") === "subject-link") {
                        if (
                          $(this).text() !== undefined &&
                          $(this).text() !== "" &&
                          !$(this).text().includes("이용규칙")
                        ) {
                          temp[count] = $(this).attr("href");
                          count = count + 1;
                        }
                      }
                    });

                  let links = temp;

                  let arr = [];

                  for (let k = 0; k < links.length; k++) {
                    if (list[k] !== undefined) {
                      arr.push(`[${list[k]}](${links[k]})`);
                    }
                  }

                  linkList.push(arr);
                  userNameList.push(searchGroup[i]);
                  // console.log(`검색 후 for문 ${i}번째 통과`);
                });
            } else { // 개인 검색 중 없는 경우
              // console.log(`검색 후 for문 ${i}번째 통과`);
              errorUserName.push(searchGroup[i]);
            }
          })
      }

      sumObj["userName"] = userNameList;
      sumObj["links"] = linkList;
      sumObj["errorList"] = errorUserName;

      // console.log(`sumObj : ${JSON.stringify(sumObj)}`);

      let okName = [];
      let notOkName = [];

      for(let k = 0; k < sumObj["userName"].length; k++){
        if(sumObj["links"][k] == "") {
          okName.push(sumObj["userName"][k]);
        } else {
          notOkName.push(sumObj["userName"][k]);
        }
      }

      // console.log(`notOkName: ${notOkName}`);
      // console.log(`okName: ${okName}`);

      let resultEmbed = new MessageEmbed()
        .setColor("#8B00FF")
        .setTitle(`${searchGroup.join(", ")} 에 대한 사사게 검색 결과입니다.`)
        .addFields(
          {
            name: `\`검 색 결 과\``,
            value: `${notOkName.join(", ") !== "" ? notOkName.join(", ")+" 는(은) \`사사게 검색 결과가 존재\`합니다!\n\`/사사게 [닉네임]\` 명령어를 통해 개개인별 상세 내역을 확인하실 수 있습니다.\n\n" : ""}${okName.join(", ") !== "" ? okName.join(", ")+" 는(은) 사사게 검색 결과가 존재하지 않습니다.\n\n" : ""}${sumObj["errorList"].join(", ") !== "" ? sumObj["errorList"].join(", ")+" 는(은) 닉네임을 잘못 입력하신 것 같군요!" : ""}`
          },
          {
            name: `\`참 고 사 항\``,
            value: `- 사건/사고 게시판에서 제목+내용 으로 검색한 결과입니다.
                    - 게시글 1만개 단위로 검색됩니다.
                    - 더 자세한 내용은 인벤 사건/사고 게시판을 이용해주시길 바랍니다.`,
          }
        );

      interaction.editReply({ embeds: [resultEmbed] });
    } catch(error) {
      console.error(`사사게 단체 검색 중 에러 발생 : ${error}`);

      fs.appendFile(
        "logs/bugLog.txt",
        `${now} || /사사게 단체 검색 ${username}\n || ${error}`,
        (error) => {
          // console.error(`사사게 로그 남길 때 에러 발생 : ${error}`);
        }
      );
    }
  }
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('사사게')
		.setDescription('인벤 사건/사고 게시판에 입력한 닉네임을 검색한 결과를 출력합니다.')
    .addStringOption(option =>
      option.setName('닉네임') //! 옵션 이름에는 공백이 들어가면 안된다. 에러 발생함.
        .setDescription('사사게에 검색할 닉네임을 입력합니다.')
        .setRequired(true)),
	async execute(interaction) {
    let now = new Date();
    let userNickName = (JSON.stringify(interaction.options._hoistedOptions[0]["value"])).replace(/\"/gi, "");
    // console.log(`input name : ${userNickName}`);

    try {
      await interaction.deferReply();
      await sasagaeUserSearch(userNickName, interaction);
    } catch(error) {
      console.error(`error: ${error}`)

      fs.appendFile(
        "logs/useLog.txt",
        `${now} || /사사게 검색 이후 메시지 보낼 떄 에러 발생 ${userNickName} || ${error}\n`,
        (error) => {
          // console.error(`사사게 로그 남길 때 에러 발생 : ${error}`);
        }
      );
    }
	},
};
