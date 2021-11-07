const { MessageEmbed } = require("discord.js");

const doMessageClear = async (message, client) => {
  const embedMessage = new MessageEmbed()
    .setColor("#ff3399")
    .setTitle(`메시지 삭제 경고`)
    .setDescription(
      `정말 메시지를 삭제하겠습니까?\n\n가장 최근 메시지부터 30개의 메시지가 삭제되며,\n삭제된 메시지는 복구되지 않습니다.\n\n삭제를 계속 진행하고 싶다면 🧹 이모지를 클릭해주세요.\n마음이 바뀌었다면 ❌ 이모지를 클릭해주세요.`
    );

  let sendedEmbed = message.channel.send({
    embeds: [embedMessage],
  });

  (await sendedEmbed).react(`🧹`);
  (await sendedEmbed).react(`❌`);

  client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;

    const messages = await message.channel.messages.fetch({ limit: 31 });

    if (reaction.emoji.name === `🧹`) {
      if (messages) {
        if (message.channel.type === "GUILD_TEXT") {
          message.channel.bulkDelete(messages);
        }
      }
    }
    if (reaction.emoji.name === `❌`) {
      if (messages) {
        if (message.channel.type === "GUILD_TEXT") {
          message.channel.bulkDelete(1);
        }
      }
    }
  });
};

module.exports = { doMessageClear };
