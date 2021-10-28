const axios = require("axios");

const embedMessage = `@here\`\`\`diff\n일요일 로스트아크 일정\n\n- 필드 보스 & 모험섬 출현 10분 전입니다.\n\n+ 필드 보스는 매 정시마다, 모험섬은 9:00, 11:00, 13:00, 19:00, 21:00, 23:00 에 열립니다.\n주말 모험섬은\n1부 9:00, 11:00, 13:00\n2부 19:00, 21:00, 23:00\n로 나뉘며, 각각 보상 획득이 가능합니다.\`\`\``;

exports.handler = async (event) => {
  try {
    const result = await axios.post(
      "https://discord.com/api/webhooks/902885267248140388/svfgLamPcxOuhP3c_y3ZAkKneegcJp81OJ-o8gm5AjQVFKJMghUdvB5Gl1f9suQBZ9ke",
      {
        content: embedMessage,
      }
    );
    console.info("디스코드 훅 연동 성공");
  } catch (err) {
    console.err("디스코드 훅 연동 실패", err);
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify("Lambda 정상적으로 작동중."),
  };
  return response;
};
