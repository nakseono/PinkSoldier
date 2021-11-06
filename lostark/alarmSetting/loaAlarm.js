const cron = require("node-cron");
const axios = require("axios");

const roleID = "903603653393412158";
const channelID =
  "https://discord.com/api/webhooks/906025451397480459/GBay7gmU3cx8k314PgZHVfxALZvTWMk_ajIol8DxKLJ2l81Ca1XbrszL-3DICn_kUDS8";
const monMessage = `---\n\`\`\`diff\n월요일 로스트아크 일정\n\n- 카오스 게이트 & 모험섬 출현 10분 전입니다.\n\n+ 카오스 게이트는 매 정시마다, 모험섬은 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\`\`\``;

const monAlarm = cron.schedule(
  () => {
    axios.post(channelID, { content: monMessage });
  },
  { scheduled: false }
);

// cron.schedule("* * * * *", monAlarm);

module.exports = { monAlarm };
