const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

const createLoawaLinkEmbed = async (userName) => {
  let embedMessage;

  // console.log(`username : ${userName}`)

  await axios
    .get(
      `https://lostark.game.onstove.com/Profile/Character/${encodeURI(userName)}`
    )
    .then((html) => {
      const $ = cheerio.load(html.data);

      if ($(`.profile-character-info__name`).text()) {
        embedMessage = new MessageEmbed()
        .setColor("#ff3399")
        .addFields({
          name: `링크 클릭시 로아와 페이지로 이동합니다.`,
          value: `https://loawa.com/char/${userName}`,
        });
      } else {
        embedMessage = new MessageEmbed()
          .setColor("#ff3399")
          .setTitle(`오류가 발생했습니다!`)
          .setDescription(
            `정보를 찾을 수 없습니다.\n입력한 닉네임이 정확한지 확인해주세요.`
          );
      }
      // console.log(`loawa: ${JSON.stringify(embedMessage)}`);
    });
    // console.log(`test: ${embedMessage}`);
    return embedMessage;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('로아와')
		.setDescription('입력된 [닉네임]에 해당하는 로아와 링크를 출력합니다.')
    .addStringOption(option =>
      option.setName('닉네임') //! 옵션 이름에는 공백이 들어가면 안된다. 에러 발생함.
        .setDescription('로아와에 검색할 닉네임을 입력합니다.')
        .setRequired(true)),
	async execute(interaction) {
    let now = new Date();
    let userNickName = (JSON.stringify(interaction.options._hoistedOptions[0]["value"])).replace(/\"/gi, "");

    try {
      let returnEmbed = await (createLoawaLinkEmbed(userNickName));
      await interaction.reply({ embeds: [returnEmbed] });

      fs.appendFile(
        "logs/useLog.txt",
        `${now} || /로아와 ${userNickName}\n`,
        (error) => {
          // console.error(`로아와 로그 남길 때 에러 발생 : ${error}`);
        }
      );

    } catch(error) {
      console.error(`error: ${error}`)

      fs.appendFile(
        "logs/useLog.txt",
        `${now} || /로아와 ${userNickName}\n`,
        (error) => {
          // console.error(`로아와 로그 남길 때 에러 발생 : ${error}`);
        }
      );
    }
	},
};