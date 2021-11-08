const { MessageEmbed } = require("discord.js");

const madeNotice = (client, message) => {
  const noticeMessage = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle("핑크솔져봇 공지사항")
    .setDescription(message.content.replace("!@#공지", ""));

  client.guilds.cache.forEach((guild) => {
    guild.channels.cache
      .find((x) =>
        x.name.includes("로스트아크-알람" || "공지" || "일반" || "general")
      )
      .send({ embeds: [noticeMessage] });
  });
};

const whenStart = (client) => {
  const againExeNotice = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle(`확인해주세요!`)
    .setDescription(
      `핑크솔져는 업데이트 되었을 때 로스트아크 스케쥴 알림이 초기화 됩니다.\n이 알림이 보였다면 \`!알람실행\` 명령어를 다시 입력시켜주세요!\n번거롭게 해드려 죄송합니다!`
    );

  client.guilds.cache.forEach((guild) => {
    if (guild.channels.cache.find((x) => x.name === "로스트아크-알람")) {
      guild.channels.cache
        .find((x) => x.name.includes("로스트아크-알람"))
        .send({ embeds: [againExeNotice] });
    }
  });
};

module.exports = { madeNotice, whenStart };
