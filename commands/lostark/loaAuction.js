const fs = require("fs");
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

const createAuctionEmbed = async (value) => {
  let embedMessage;

  try {
    const people4 = Math.floor(value * 0.6478);
    const people8 = Math.floor(value * 0.7556);

    embedMessage = new MessageEmbed()
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

      fs.appendFile(
        "/logs/useLog.txt",
        `${now} || /경매 ${value}\n`,
        (err) => {
          // console.log(`경매 에러 : ${err}`);
        }
      );

      return embedMessage;
  } catch (error) {
    // 에러 메시지 기록 할 것 : 일시, 어떤 입력을 했는지 -> userName, 무슨 에러가 발생했는지
    let now = new Date();

    fs.appendFile(
      "/logs/bugLog.txt",
      `${now} || /경매 ${value} / ${error}\n`,
      (err) => {
        // console.log(`경매 에러 : ${err}`);
      }
    );
  }
};


module.exports = {
	data: new SlashCommandBuilder()
		.setName('경매')
		.setDescription('입력된 [가격]에 대하여 최대 얼마까지 입찰해야 이득인지 계산합니다.')
    .addStringOption(option =>
      option.setName('가격') //! 옵션 이름에는 공백이 들어가면 안된다. 에러 발생함.
        .setDescription('계산할 경매 금액을 입력합니다.')
        .setRequired(true)),
	async execute(interaction) {
    let now = new Date();
    let amount = (JSON.stringify(interaction.options._hoistedOptions[0]["value"])).replace(/\"/gi, "");
    console.log(`amount : ${amount}`);

    try {
      let returnEmbed = await createAuctionEmbed(amount);
      console.log(returnEmbed);

      await interaction.reply({ embeds: [returnEmbed] });

      fs.appendFile(
        "/logs/useLog.txt",
        `${now} || /경매 ${value}\n`,
        (err) => {
          // console.log(`경매 에러 : ${err}`);
        }
      );
    } catch(error) {
      console.error(`error: ${error}`)

      fs.appendFile(
        "/logs/bugLog.txt",
        `${now} || /경매 ${value} / ${error}\n`,
        (err) => {
          // console.log(`경매 에러 : ${err}`);
        }
      );
    }

	},
};