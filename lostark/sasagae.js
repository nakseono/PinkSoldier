const { MessageEmbed } = require("discord.js");
const axios = require("axios");
const cheerio = require("cheerio");

const sasagaeEmbed = async (message, userName, errorMessage) => {
  if (userName.includes("/")) {
    // "김낙서/김낙떠/낙서노"

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

    sasagaeGroup(userGroup, message);
    // console.log(`user log : ${JSON.stringify(userGroup)}`);
  } else {
    try {
      await axios
        .get(
          `https://www.inven.co.kr/board/lostark/5355?query=list&p=1&sterm=&name=subjcont&keyword=${encodeURI(
            userName
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

          if (arr.length === 0) {
            sasagae(`검색 결과가 존재하지 않습니다!`, userName, message);
          } else if (arr.length < 3) {
            sasagae(arr.join(`\n`), userName, message);
          } else {
            sasagae(arr.slice(3).join(`\n`), userName, message);
          }
        });
    } catch (error) {
      message.channel.send({ embeds: [errorMessage] });
    }
  }
};

const sasagae = async (input, userName, message) => {
  const embedMessage = new MessageEmbed()
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
  const already = await message.channel.messages.fetch({ limit: 1 });

  message.channel.bulkDelete(already);
  message.channel.send({ embeds: [embedMessage] });
};

const sasagaeGroup = async (obj, message) => {
  const already = await message.channel.messages.fetch({ limit: 1 });
  message.channel.bulkDelete(already);

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

    const embedMessage = new MessageEmbed()
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

    message.channel.send({ embeds: [embedMessage] });
  }
};

module.exports = { sasagaeEmbed };
