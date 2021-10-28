const { Client, Intents } = require("discord.js");
const { token, prefix } = require("./config.json");
const { MessageEmbed } = require("discord.js");
const { getUserInfo } = require("./lostark/loaInfo/loaInfoData.js");
const {
  createLoaInfoEmbed,
  createLoawaLinkEmbed,
} = require("./lostark/loaInfo/loaInfoEmbed");
const { createAuctionEmbed } = require("./lostark/loaAuction");
const { returnOrderList } = require("./orderList");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    "GUILDS",
    "GUILD_MESSAGES",
    "DIRECT_MESSAGES",
  ],
  partials: ["CHANNEL"],
});

client.once("ready", () => {
  console.log("핑크솔져 준비 완료");
});

client.on("messageCreate", async (message) => {
  const order = message.content.split(" ")[0];
  const orderWithOutPrefix = message.content.split(" ")[1];

  //! 봇 메시지만 제외하고 콘솔에 찍는 기능.
  // if (!message.author.bot) {
  //   console.log(message.data);
  // }

  //! 봇 메시지가 아니며, 접두사로 시작하는지 우선적으로 검사
  //! 이후 각 명령어에 따라서 각기 다른 결과 출력
  if (!message.author.bot) {
    if (order === `${prefix}명령어`) {
      message.channel.send({
        embeds: [returnOrderList()],
      });
    }

    if (order === `${prefix}정보`) {
      getUserInfo(orderWithOutPrefix).then((data) => {
        // getUserInfo로 유저이름을 보내서 함수를 실행시키고, 해당 함수의 결과로 출력된 data를 임베드로 가공한다.
        message.channel.send({
          embeds: [createLoaInfoEmbed(orderWithOutPrefix, data)],
        });
      });
    }

    if (order === `${prefix}분배`) {
      message.channel.send({
        embeds: [createAuctionEmbed(orderWithOutPrefix)],
      });
    }

    if (order === `${prefix}로아와`) {
      message.channel.send({
        embeds: [createLoawaLinkEmbed(orderWithOutPrefix)],
      });
    }
  }

  //! --------------------------------------------------------
});

client.login(token);
