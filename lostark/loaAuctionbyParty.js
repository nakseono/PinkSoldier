const { MessageEmbed } = require("discord.js");

const createAuctionbyPartyEmbed = async (value, message, errorMessage) => {
  if (!Number.isInteger(value)) {
    message.channel.send({ embeds: [isNotIntegerEmbed] });
  } else {
    try {
      const people4 = Math.floor(value * 0.95 * (3 / 4));
      const people8 = Math.floor(value * 0.95 * (7 / 8));

      const embedMessage = new MessageEmbed()
        .setColor("#ff3399")
        .setTitle(`경매 분배금 계산 - ${value}골드`)
        .addFields(
          {
            name: `4인 기준`,
            value: `\`${people4}\` 골드 입찰!`,
            // inline: true,
          },
          {
            name: "8인 기준",
            value: `\`${people8}\` 골드 입찰!`,
            // inline: true,
          }
        );

      message.channel.send({ embeds: [embedMessage] });
    } catch (err) {
      // 에러 메시지 출력
      const already = await message.channel.messages.fetch({ limit: 1 });

      message.channel.bulkDelete(already);

      message.channel.send({ embeds: [errorMessage] });

      // 에러 메시지 기록 할 것 : 일시, 어떤 입력을 했는지 -> userName, 무슨 에러가 발생했는지
      let now = new Date();

      fs.appendFile(
        "bugLog.txt",
        `${now} / !정보 ${userName} / ${error}\n`,
        (err) => {
          // console.log(`정보 에러 : ${err}`);
        }
      );
    }
  }
};

const isNotIntegerEmbed = new MessageEmbed()
  .setColor("#ff3399")
  .setTitle(`오류가 발생했습니다!`)
  .setDescription(`입력된 값이 순수한 숫자인지 확인해주세요.`);

module.exports = { createAuctionbyPartyEmbed };
