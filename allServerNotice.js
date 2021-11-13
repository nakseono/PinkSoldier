const { MessageEmbed } = require("discord.js");

const madeNotice = (client, message) => {
  const noticeMessage = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle("믹스테잎봇 공지사항")
    .setDescription(message.content.replace("!!!공지", ""));

  client.guilds.cache.forEach((guild) => {
    guild.channels.cache
      .find((x) =>
        x.name.includes("공지" || "데일리-로아-알림" || "일반" || "general")
      )
      .send({ embeds: [noticeMessage] });
  });
};

module.exports = { madeNotice };
