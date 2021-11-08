const { Client, Intents } = require("discord.js");

const { token, prefix } = require("./config.json");
const { getUserInfo } = require("./lostark/loaInfo/loaInfoData.js");
const {
  createLoaInfoEmbed,
  createLoawaLinkEmbed,
} = require("./lostark/loaInfo/loaInfoEmbed");
const { createAuctionbyPartyEmbed } = require("./lostark/loaAuctionbyParty");
const { createAuctionEmbed } = require("./lostark/loaAuction");
const { returnOrderList } = require("./orderList");
const { addRoleEmbed } = require("./addCalendarRole");
const { doMessageClear } = require("./messageClear");
const { loaEvent } = require("./lostark/loaEvent");
const { incomeCalc, watingMessage } = require("./lostark/incomeCalc");
const { makeAlarmChannel } = require("./lostark/alarmSetting/makeChannel");
const { makeRole } = require("./lostark/alarmSetting/makeRole");
const { loaAlarm } = require("./lostark/alarmSetting/loaAlarm");
const { madeNotice, whenStart } = require("./allServerNotice");

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

client.once("ready", () => {
  console.log("핑크솔져 준비 완료");

  // client.user.setPresence({
  //   activities: [{ name: "!명령어" }],
  // });

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
    if (order === `!@#공지`) madeNotice(client, message);

    if (order === `${prefix}명령어`) returnOrderList(message);

    if (order === `${prefix}정보`)
      getUserInfo(orderWithOutPrefix).then((data) => {
        createLoaInfoEmbed(orderWithOutPrefix, data, message);
      });

    if (order === `${prefix}경매`)
      createAuctionEmbed(orderWithOutPrefix, message);

    if (order === `${prefix}분배`)
      createAuctionbyPartyEmbed(orderWithOutPrefix, message);

    if (order === `${prefix}로아와`)
      createLoawaLinkEmbed(orderWithOutPrefix, message);

    if (order === `${prefix}청소`) doMessageClear(message, client);

    if (order === `${prefix}이벤트`) loaEvent(message);

    if (order === `${prefix}정산`)
      watingMessage(message, orderWithOutPrefix),
        incomeCalc(message, orderWithOutPrefix, client);

    if (order === `${prefix}알람세팅`) {
      channelID = await makeAlarmChannel(message);
      roleID = await makeRole(message);

      // console.log(`ChannelID : ${channelID}`);
      // console.log(`RoleID : ${roleID}`);

      addRoleEmbed(message, client, roleID);

      loaAlarm(client, message, channelID, roleID);
    }

    if (order === `${prefix}알람역할`) {
      addRoleEmbed(message, client);
    }

    if (order === `${prefix}알람실행`) {
      loaAlarm(client, message);
    }
  }
});

client.login(token);
