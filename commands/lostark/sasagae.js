const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');


const sasagaeEmbed = async (userName) => {
  console.log("embed start");
  if (userName.includes("/")) {
    // "김낙서/김낙떠/낙서노"
    try {
      let searchGroup = userName.split("/");
      // searchGroup = ["김낙서","김낙떠","낙서노"]

      console.log(`splitUserName : ${searchGroup}`);

      var userGroup = {};
      var linkList = [];

      for (let i = 0; i < searchGroup.length; i++) {
        await axios
          .get(
            `https://www.inven.co.kr/board/lostark/5355?query=list&p=1&sterm=&name=subjcont&keyword=${encodeURI(
              searchGroup[i]
            )}`
          )
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
          });
      }
      userGroup["userName"] = searchGroup;
      userGroup["links"] = linkList;

      console.log(`user log : ${JSON.stringify(userGroup)}`);
      sasagaeGroup(userGroup);
      } catch(error) {
        sasagae("error", userName);

        console.error(`error: ${error}`)

        fs.appendFile(
          "logs/useLog.txt",
          `${now} || /사사게 ${userNickName}\n`,
          (error) => {
            // console.error(`사사게 로그 남길 때 에러 발생 : ${error}`);
          }
        );
      }
  } else {
    try {
      await axios
        .get(
          `https://www.inven.co.kr/board/lostark/5355?query=list&p=1&sterm=&name=subjcont&keyword=${encodeURI(
            userName
          )}`
        )
        .then( async (html) => {
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

          console.log(`글 리스트 : ${list}`);

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

          console.log(`글 링크 : ${arr}`);

          let resultEmbed;

          if (arr.length === 0) {
            console.log(`sasagae #1`)
            resultEmbed = await sasagae(`검색 결과가 존재하지 않습니다!`, userName);
            console.log(`if문 내 resultEmbed : ${JSON.stringify(resultEmbed)}`);
          } else if (arr.length < 3) {
            console.log(`sasagae #2`)
            resultEmbed = await sasagae(arr.join(`\n`), userName);
          } else {
            console.log(`sasagae #3`)
            resultEmbed = await sasagae(arr.slice(3).join(`\n`), userName);
          }

          console.log(`최종 return resultEmbed : ${JSON.stringify(resultEmbed)}`);
          return resultEmbed;
        });
    } catch (error) {
      sasagae("error", userName);

      console.error(`error: ${error}`)

      fs.appendFile(
        "logs/useLog.txt",
        `${now} || /사사게 ${userName}\n`,
        (error) => {
          // console.error(`사사게 로그 남길 때 에러 발생 : ${error}`);
        }
      );
    }
  }
};

const sasagae = async (input, userName) => {
  let embedMessage;

  if (input === "error") {
    embedMessage = new MessageEmbed()
      .setColor("#ff3399")
      .setTitle(`오류가 발생했습니다!`)
      .setDescription(
        `정보를 찾을 수 없습니다.\n입력한 닉네임이 정확한지 확인해주세요.`
      );
  } else {
    embedMessage = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle(`${userName} 에 대한 사사게 검색 결과입니다.`)
    .addFields(
      {
        name: `\`검 색 결 과\``,
        value: input,
      },
      {
        name: `\`참 고 사 항\``,
        value: `- 사건/사고 게시판에서 제목+내용 으로 검색한 결과입니다.
    - 게시글 1만개 단위로 검색됩니다.
    - 더 자세한 내용은 인벤 사건/사고 게시판을 이용해주시길 바랍니다.`,
      }
    );
  }

  console.log(`embedMessage : ${JSON.stringify(embedMessage)}`)
  return embedMessage;
};

const sasagaeGroup = async (obj) => {
  let embedMessage;

  for (let i = 0; i < obj["links"].length; i++) {
    let links = obj["links"][i];

    if (links.length === 0) {
      list = `검색 결과가 존재하지 않습니다!`;
    } else if (links.length < 3) {
      list = links.join(`\n`);
    } else {
      list = links.slice(3).join(`\n`);
    }

    // console.log(`${obj["userName"][i]} : ${list}`);

    embedMessage = new MessageEmbed()
      .setColor("#ff3399")
      .setTitle(`${obj["userName"][i]} 에 대한 사사게 검색 결과입니다.`)
      .addFields(
        {
          name: `\`검 색 결 과\``,
          value: list,
        },
        {
          name: `\`참 고 사 항\``,
          value: `- 사건/사고 게시판에서 제목+내용 으로 검색한 결과입니다.
    - 게시글 1만개 단위로 검색됩니다.
    - 더 자세한 내용은 인벤 사건/사고 게시판을 이용해주시길 바랍니다.`,
        }
      );
  }

  return embedMessage;
};

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
    console.log(`input name : ${userNickName}`);

    try {
      console.log('1234');
      let returnEmbed = await sasagaeEmbed(userNickName);
      console.log(`returnEmbed : ${returnEmbed}`)
      // returnEmbed = await sasagae("error", "낙서노");

      await interaction.reply({ embeds: [returnEmbed] });
    } catch(error) {
      console.error(`error: ${error}`)

      fs.appendFile(
        "logs/useLog.txt",
        `${now} || /사사게 ${userNickName}\n`,
        (error) => {
          // console.error(`사사게 로그 남길 때 에러 발생 : ${error}`);
        }
      );
    }
	},
};
