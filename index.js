const { Client, Intents, MessageEmbed } = require("discord.js");

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

  const noticeMessage = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle(`설정해주세요!`)
    .setDescription(
      `핑크솔져는 업데이트 되었을 때(서버가 내려갔다가 다시 올렸을 때) 로스트아크 스케쥴 알림이 초기화 됩니다.\n이 알림이 보였다면 \`!알람\` 명령어를 다시 실행시켜주세요! 번거롭게 해드려 죄송합니다!`
    );

  client.guilds.cache.forEach((guild) => {
    guild.channels.cache
      .find((x) => x.name.includes("test"))
      .send({ embeds: [noticeMessage] });
  });
});

client.on("messageCreate", async (message) => {
  const order = message.content.split(" ")[0];
  const orderWithOutPrefix = message.content.split(" ")[1];

  let roleID;
  let channelID;

  //! 봇 메시지만 제외하고 콘솔에 찍는 기능.
  // if (!message.author.bot) {
  //   console.log(message.data);
  // }

  //! 봇 메시지가 아닌지 우선적으로 검사
  //! 이후 각 명령어에 따라서 각기 다른 결과 출력

  if (!message.author.bot) {
    if (order === `!@#공지`) {
      noticeMessage = new MessageEmbed()
        .setColor("#ff3399")
        .setTitle("핑크솔져봇 공지사항")
        .setDescription(message.content.replace("!@#공지", ""));

      client.guilds.cache.forEach((guild) => {
        guild.channels.cache
          .find((x) => x.name.includes("test"))
          .send({ embeds: [noticeMessage] });
      });
    }

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
      addRoleEmbed(message, client, roleID);
      loaAlarm(client, channelID, roleID);

      console.log(`RoleID : ${roleID}`);
      console.log(`ChannelID : ${channelID}`);
    }

    // if (order === `${prefix}알람`) ;

    // if (order === `${prefix}알람실행`) {
    //   console.log(`알람 실행 channelID : ${channelID} roleID : ${roleID}`);
    // }
  }
});

client.login(token);

// cron.schedule("* * * * * *", monAlarm);
