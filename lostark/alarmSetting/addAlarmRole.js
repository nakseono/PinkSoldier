const { MessageEmbed } = require("discord.js");

const addEmoji = `⏰`;
const removeEmoji = `🔕`;

const addRoleEmbed = async (message, client) => {
  const embedMessage = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle(`데일리 로아 알림`)
    .setDescription(
      `데일리 알람을 받고 싶다면 알람시계(${addEmoji}) 이모티콘을 클릭하세요.\n이전에 알람 신청을 했는데 이제는 알람을 받고싶지 않다면 무음모드${removeEmoji} 이모티콘을 클릭하세요.`
    );

  let sendedEmbed = message.channel.send({ embeds: [embedMessage] });

  (await sendedEmbed).react(addEmoji);
  (await sendedEmbed).react(removeEmoji);

  let alarmRole = message.guild.roles.cache.find(
    (role) => role.name === "loaAlarm"
  );

  client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;

    // console.log(JSON.stringify(reaction));

    if (reaction.emoji.name === addEmoji) {
      reaction.message.guild.members.cache.get(user.id).roles.add(alarmRole);
    }

    if (reaction.emoji.name === removeEmoji) {
      reaction.message.guild.members.cache.get(user.id).roles.remove(alarmRole);
    }
  });
};

module.exports = { addRoleEmbed };
