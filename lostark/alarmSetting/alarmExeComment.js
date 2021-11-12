const { MessageEmbed } = require("discord.js");
const fs = require("fs");

const alarmExeComment = (message, client) => {
  const embedMessage = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle(`캘린더 알림 실행!`)
    .setDescription(
      `알림이 실행되었습니다.\`데일리-로아-알림\` 채널에 알림이 들어갈거에요!\n`
    );

  let data = JSON.parse(fs.readFileSync("alarmData.json"));
  for (let i = 0; i < data.length; i++) {
    channelID = data[i]["channel"];
    client.channels.cache.get(`${channelID}`).send("test");
  }

  message.channel.send({ embeds: [embedMessage] });
};

module.exports = { alarmExeComment };
