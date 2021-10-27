const { Client, Intents } = require("discord.js");
const { token, prefix } = require("./config.json");
const { MessageEmbed } = require("discord.js");
const { getUserInfo } = require("./lostark/loaInfo/loaInfoData.js");
const { createLoaInfoEmbed } = require("./lostark/loaInfo/loaInfoEmbed");
const { createAuctionEmbed } = require("./lostark/loaAuction");

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
    if (order === `${prefix}정보`) {
      getUserInfo(orderWithOutPrefix).then((data) => {
        const embed = createLoaInfoEmbed(orderWithOutPrefix, data);

        message.channel.send({ embeds: [embed] });
      });
    }

    if (order === `${prefix}경매`) {
      const embed = createAuctionEmbed(orderWithOutPrefix);
      message.channel.send({ embeds: [embed] });
    }
  }

  //! --------------------------------------------------------
});

client.login(token);

//? DONE
//? - 로스트아크 전투정보실 DATA
//? - 경매 최적가 계산기
//! 코드 리팩토링 및 스플릿

//? 진행 중 기능

//? 구현해야 할 기능
//? - 로스트아크 일정표에 맞춰서 모험섬, 카오스게이트 등 알림기능
//? - 보유 캐릭터 목록 표시해서 주간 수입 보상 합계
//? - 각 군단장 보상 및 더보기 비용 등. : 참고링크 - https://www.inven.co.kr/board/lostark/4821/83355
//? - 더 많은 정보를 원한다면? - 로아와 링크 걸기.

//? +@
//? YouTube API 연동해서 노래 기능까지 추가

//? 할까?
//? xlsx 모듈 이용해서 수요눕클회 스프레트 시트에서 일정 안 만진사람 알림가도록 - 스프레드 시트 이제 눕클회에서 안 쓰일 것 같은데...
