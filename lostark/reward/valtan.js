const { MessageEmbed } = require("discord.js");

const createValtanRewardEmbed = (value) => {
  const embedMessage = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle(`레이드별 보상 정리 - 발탄`)
    .addFields(
      {
        name: "노말",
        value: `\`1관문\` - 800G\n\`2관문\` - 2500G\n\`합 계\` - 3300G`,
        inline: true,
      },
      {
        name: "하드",
        value: `\`1관문\` - 1000G\n\`2관문\` - 3500G\n\`합 계\` - 4500G`,
        inline: true,
      }
    );

  return embedMessage;
};

module.exports = { createValtanRewardEmbed };
