const { MessageEmbed } = require("discord.js");

const embedMessage = new MessageEmbed()
  .setColor("#ff3399")
  .setTitle(`설정 먼저 해주세요!`)
  .setDescription(
    `좌측 채널 목록에서 방금 생성된 \`데일리-로아-알림\` 채팅 채널을 
    우클릭 후, \`알림 설정\` - \`@mentions만\` 을 체크해주세요!
    \`!알림역할\`을 부여받지 않은 서버 인원들에게는 알림이 안가도록 설정됩니다!`
  );

const makeAlarmChannel = async (message) => {
  const temp = await message.guild.channels
    .create("데일리-로아-알림", {
      type: "text",
      permissionOverwrites: [
        {
          id: message.guild.roles.everyone,
          allow: ["VIEW_CHANNEL"],
          deny: [],
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
