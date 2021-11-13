const { MessageEmbed } = require("discord.js");
const fs = require("fs");

const addEmoji = `⏰`;
const removeEmoji = `🔕`;

const addRoleEmbed = async (message, client) => {
  let data = JSON.parse(fs.readFileSync("alarmData.json"));

  let roleArr = [];
  for (let i = 0; i < data.length; i++) {
    roleArr[i] = data[i]["role"];
  }

  const embedMessage = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle(`데일리 로아 알림`)
    .setDescription(
      `데일리 알람을 받고 싶다면 알람시계(${addEmoji}) 이모티콘을 클릭하세요.
      이전에 알람 신청을 했는데 이제는 알람을 받고싶지 않다면 무음모드${removeEmoji} 이모티콘을 클릭하세요.
      이 설정 메시지는 \`!알람역할\` 명령어를 통해 언제든지 불러낼 수 있습니다.`
    );

  let sendedEmbed = message.channel.send({ embeds: [embedMessage] });

  (await sendedEmbed).react(addEmoji);
  (await sendedEmbed).react(removeEmoji);

  client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;

    // console.log(JSON.stringify(reaction));

    try {
      if (reaction.emoji.name === addEmoji) {
        reaction.message.guild.members.cache.get(user.id).roles.add(roleArr);
      }
    } catch (error) {
      console.log(error);
    }

    try {
      if (reaction.emoji.name === removeEmoji) {
        reaction.message.guild.members.cache.get(user.id).roles.remove(roleArr);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = { addRoleEmbed };
