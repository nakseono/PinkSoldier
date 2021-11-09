const { MessageEmbed } = require("discord.js");

const madeNotice = (client, message) => {
  const noticeMessage = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle("핑크솔져봇 공지사항")
    .setDescription(message.content.replace("!!!공지", ""));

  client.guilds.cache.forEach((guild) => {
    guild.channels.cache
      .find((x) =>
        x.name.includes("공지" || "데일리-로아-알림" || "일반" || "general")
      )
      .send({ embeds: [noticeMessage] });
  });
};

const whenStart = (client) => {
  const againExeNotice = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle(`확인해주세요!`)
    .setDescription(
      `핑크솔져는 업데이트 되었을 때 알림 받아오는 기능이 초기화 됩니다.\n이 알림이 보였다면, 그리고 데일리 로아 알림을 계속 받고싶으시다면\n\`!알람실행\` 명령어를 다시 입력시켜주세요!`
    );

  client.guilds.cache.forEach((guild) => {
    if (guild.channels.cache.find((x) => x.name === "데일리-로아-알림")) {
      guild.channels.cache
        .find((x) => x.name.includes("데일리-로아-알림"))
        .send({ embeds: [againExeNotice] });
    }
  });
};

module.exports = { madeNotice, whenStart };
