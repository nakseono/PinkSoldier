const { MessageEmbed } = require("discord.js");

const createAuctionbyPartyEmbed = (value, message) => {
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
};

module.exports = { createAuctionbyPartyEmbed };
