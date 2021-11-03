const axios = require("axios");
const cheerio = require("cheerio");
const { MessageEmbed } = require("discord.js");

const loaEvent = (message) => {
  axios.get(`https://lostark.game.onstove.com/News/Event/Now`).then((html) => {
    const $ = cheerio.load(html.data);
    let event = {};
    // 링크
    let temp = [];
    $("div.list.list--event > ul > li > a").each(function (index, item) {
      temp[index] = $(this).attr("href");
    });
    event["link"] = temp;

    // 썸네일
    temp = [];
    let temp2 = [];
    $("div.list.list--event > ul > li > a > div.list__thumb > img").each(
      function (index, item) {
        temp[index] = $(this).attr("src");
        temp2[index] = $(this).attr("alt");
      }
    );
    event["thumb"] = temp;
    event["subject"] = temp2;

    // 이벤트 기간
    temp = [];
    $("div.list__term").each(function (index, item) {
      temp[index] = $(this).text().split(" : ")[1];
    });
    event["term"] = temp;

    for (let i = 0; i < event["subject"].length; i++) {
      const embedMessage = new MessageEmbed()
        .setColor("#ff3399")
        .setThumbnail(`${event["thumb"][i]}`)
        .setTitle(`${event["subject"][i]}`)
        .setDescription(
          `${event["term"][i]}\n[이벤트 페이지 링크](https://lostark.game.onstove.com${event["link"][i]})`
        );

      message.channel.send({ embeds: [embedMessage] });
    }
  });
};

module.exports = { loaEvent };
