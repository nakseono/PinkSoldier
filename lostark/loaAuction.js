const { MessageEmbed } = require("discord.js");

const createAuctionEmbed = (value) => {
  const people4 = value * 0.6478;
  const people8 = value * 0.7556;

  const embedMessage = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle(`경매 최대 입찰금 계산 - ${value}골드`)
    .addFields(
      {
        name: `4인 기준`,
        value: `\`${people4}\` 골드까지만 입찰하세용`,
        // inline: true,
      },
      {
        name: "8인 기준",
        value: `\`${people8}\` 골드까지만 입찰하세용`,
        // inline: true,
      }
    );

  return embedMessage;
};

module.exports = { createAuctionEmbed };
