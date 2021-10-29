const { MessageEmbed } = require("discord.js");

const createArgusRewardEmbed = () => {
  const embedMessage = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle(`레이드별 보상 정리 - 오레하, 아르고스`)
    .addFields(
      { name: "오레하", value: `노말 - 1500G\n하드 - 1700G`, inline: true },
      {
        name: "아르고스",
        value: `\`1관문\` - 1500G\n\`2관문\` - 800G\n\`3관문\` - 1000G\n\`합계\` - 3300G`,
        inline: true,
      }
    );

  return embedMessage;
};

module.exports = { createArgusRewardEmbed };
