const { MessageEmbed } = require("discord.js");

const addEmoji = `<:play:905059107852140574>`;
const removeEmoji = `<:shy:905059134171414589>`;

const addRoleEmbed = async (message, client) => {
  const embedMessage = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle(`데일리 캘린더 알림`)
    .setDescription(
      `캘린더 알람을 받고 싶다면 아래 놀자에요(${addEmoji}) 이모티콘을 클릭하세요.\n이전에 알람 신청을 했는데 이제는 알람을 받고싶지 않다면 머쓱해요(${removeEmoji}) 이모티콘을 클릭하세요.`
    );

  let sendedEmbed = message.channel.send({ embeds: [embedMessage] });

  (await sendedEmbed).react(addEmoji);
  (await sendedEmbed).react(removeEmoji);

  const calendarRole = message.guild.roles.cache.find(
    (role) => role.name === "Calendar"
  );

  client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction._emoji.id === `905059107852140574`) {
      reaction.message.guild.members.cache.get(user.id).roles.add(calendarRole);
    }

    if (reaction._emoji.id === `905059134171414589`) {
      reaction.message.guild.members.cache
        .get(user.id)
        .roles.remove(calendarRole);
    }
  });
};

module.exports = { addRoleEmbed };
