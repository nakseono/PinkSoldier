const { Client, Intents, MessageEmbed } = require("discord.js");

const { token, prefix } = require("./config.json");
const fs = require("fs");
const { getUserInfo } = require("./lostark/loaInfo/loaInfoData.js");
const {
  createLoaInfoEmbed,
  createLoawaLinkEmbed,
} = require("./lostark/loaInfo/loaInfoEmbed");
const { createAuctionbyPartyEmbed } = require("./lostark/loaAuctionbyParty");
const { createAuctionEmbed } = require("./lostark/loaAuction");
const { returnOrderList } = require("./orderList");
const { addRoleEmbed } = require("./lostark/alarmSetting/addAlarmRole");
// const { doMessageClear } = require("./messageClear");
const { loaEvent } = require("./lostark/loaEvent");
const { incomeCalc } = require("./lostark/incomeCalc");
const { makeAlarmChannel } = require("./lostark/alarmSetting/makeChannel");
const { makeRole } = require("./lostark/alarmSetting/makeRole");
const { loaAlarm } = require("./lostark/alarmSetting/loaAlarm");
const { madeNotice, whenStart } = require("./allServerNotice");
const { alarmExeComment } = require("./lostark/alarmSetting/alarmExeComment");
const { sasagaeEmbed } = require("./lostark/sasagae");

const client = new Client({
  disableEveryone: true,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    "GUILDS",
    "GUILD_MESSAGES",
    "DIRECT_MESSAGES",
  ],
  partials: ["CHANNEL", "MESSAGE", "REACTION"],
});

const errorMessage = new MessageEmbed()
  .setColor("#ff3399")
  .setTitle(`에러가 발생했습니다!`)
  .setDescription(
    `\`!명령어\` 를 통해 다시 한번 용례를 확인해주시고,\n에러가 지속된다면 개발자에게 문의해주세요 XD`
  );

const watingMessage = (message, userName) => {
  const waitingEmbed = new MessageEmbed()
    .setColor("#ff3399")
    // .setThumbnail(`${loadingBar}`)
    .setTitle(`${userName}님의 데이터를 불러오는 중입니다.`)
    .setDescription(
      `데이터를 불러오고 가공하는데 시간이 좀 걸립니다. 조금만 기다려주세용`
    );
  message.channel.send({ embeds: [waitingEmbed] });
};

client.once("ready", () => {
  console.log("믹스테잎 준비 완료");

  client.user.setPresence({
    activities: [{ name: "도움말은 !명령어" }],
  });

  whenStart(client);
});

client.on("messageCreate", async (message) => {
  const order = message.content.split(" ")[0];
  const orderWithOutPrefix = message.content.split(" ")[1];

  //! 봇 메시지만 제외하고 콘솔에 찍는 기능.
  // if (!message.author.bot) {
  //   console.log(message.data);
  // }

  //! 봇 메시지가 아닌지 우선적으로 검사
  //! 이후 각 명령어에 따라서 각기 다른 결과 출력

  if (!message.author.bot) {
    if (order === `!!!공지`) madeNotice(client, message);

    if (order === `${prefix}명령어`) returnOrderList(message);

    if (order === `${prefix}정보`) {
      watingMessage(message, orderWithOutPrefix);
      getUserInfo(orderWithOutPrefix).then((data) => {
        createLoaInfoEmbed(orderWithOutPrefix, data, message, errorMessage);
      });
    }

    if (order === `${prefix}경매`)
      createAuctionEmbed(orderWithOutPrefix, message, errorMessage);

    if (order === `${prefix}분배`)
      createAuctionbyPartyEmbed(orderWithOutPrefix, message, errorMessage);

    if (order === `${prefix}로아와`)
      createLoawaLinkEmbed(orderWithOutPrefix, message);

    // if (order === `${prefix}청소`) doMessageClear(message, client);

    if (order === `${prefix}이벤트`) loaEvent(message);

    if (order === `${prefix}정산`)
      watingMessage(message, orderWithOutPrefix),
        incomeCalc(message, orderWithOutPrefix, errorMessage);

    if (order === `${prefix}알람세팅`) {
      channelID = await makeAlarmChannel(message);
      roleID = await makeRole(message);

      let idData = { channel: channelID, role: roleID };

      let json = JSON.parse(fs.readFileSync("alarmData.json"));
      json.push(idData);

      fs.writeFileSync("alarmData.json", JSON.stringify(json), JSON);

      // console.log(`ChannelID : ${channelID}`);
      // console.log(`RoleID : ${roleID}`);

      addRoleEmbed(message, client, roleID);

      loaAlarm(message, client);
    }

    if (order === `${prefix}알람역할`) {
      addRoleEmbed(message, client);
    }

    if (order === `${prefix}알람실행`) {
      alarmExeComment(message, client);
      loaAlarm(message, client);
    }

    if (order === `${prefix}사사게`) {
      watingMessage(message, orderWithOutPrefix),
        sasagaeEmbed(message, orderWithOutPrefix, errorMessage);
    }
  }
});

client.login(token);
