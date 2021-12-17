const { MessageEmbed } = require("discord.js");

const embedMessage = new MessageEmbed()
  .setColor("#ff3399")
  .setTitle(`채널이 생성되었습니다!`)
  .setDescription(`이제 음악 채널에서 입력해주세요 :)`);

const makeMusicChannel = async (message) => {
  const temp = await message.guild.channels
    .create("mixTape-Music", {
      type: "text",
      permissionOverwrites: [
        {
          id: message.guild.roles.everyone,
          allow: ["VIEW_CHANNEL"],
          deny: [""],
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

module.exports = { makeMusicChannel };
