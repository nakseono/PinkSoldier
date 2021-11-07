const { MessageEmbed } = require("discord.js");

const embedMessage = new MessageEmbed()
  .setColor("#ff3399")
  .setTitle(`설정 먼저 해주세요!`)
  .setDescription(
    `좌측 채널 목록에서 방금 생성된 \`로스트아크-알람\` 채팅 채널을 
    우클릭 후, \`알림 설정\` - \`@mentions만\` 을 체크해주세요!`
  );

const makeAlarmChannel = async (message) => {
  const temp = await message.guild.channels
    .create("로스트아크 알람", {
      type: "text",
      permissionOverwrites: [
        {
          id: message.guild.roles.everyone,
          allow: ["VIEW_CHANNEL"],
          deny: ["SEND_MESSAGES"],
        },
      ],
    })
    .then((result) => {
      // console.log(`this is channel ID : ${result.id}`);
      result.send({ embeds: [embedMessage] });
      return result.id;
    });

  // console.log(`temp : ${temp}`);
  return temp;
};

module.exports = { makeAlarmChannel };
