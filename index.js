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
// const { createRewardEmbed } = require("./lostark/reward/Argus");
// const { createValtanRewardEmbed } = require("./lostark/reward/valtan");
const { addRoleEmbed } = require("./addCalendarRole");
const { doMessageClear } = require("./messageClear");

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
  client.user.setPresence({
    activities: [{ name: "!명령어" }],
  });
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

    if (order === `${prefix}경매`) {
      message.channel.send({
        embeds: [createAuctionEmbed(orderWithOutPrefix)],
      });
    }

    if (order === `${prefix}분배`) {
      message.channel.send({
        embeds: [createAuctionbyPartyEmbed(orderWithOutPrefix)],
      });
    }

    if (order === `${prefix}로아와`) {
      message.channel.send({
        embeds: [createLoawaLinkEmbed(orderWithOutPrefix)],
      });
    }

    if (order === `${prefix}클리어`) {
      // const messages = await message.channel.messages.fetch({ limit: 31 });
      // if (messages) {
      //   if (message.channel.type === "GUILD_TEXT") {
      //     message.channel.bulkDelete(messages);
      //   }
      // }

      doMessageClear(message);
    }

    if (order === `${prefix}알림`) {
      const addEmoji = `<:play:897771801634041888>`;
      const removeEmoji = `<:ash:904697223416262716>`;

      const calendarRole = message.guild.roles.cache.find(
        (role) => role.name === "Calendar"
      );

      let embed = message.channel.send({
        embeds: [addRoleEmbed()],
      });

      (await embed).react(`✅`);
      (await embed).react(removeEmoji);

      client.on("messageReactionAdd", async (reaction, user) => {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;
        if (!reaction.message.guild) return;

        console.log(`add : ${user.id}`);

        if (reaction.message.channel.id == "904694895757889558") {
          console.log(`click`);
          if (reaction.emoji.name === `✅`) {
            console.log("add check");
            reaction.message.guild.members.cache
              .get(user.id)
              .roles.add(calendarRole);
          } else return;
        }
      });

      client.on("messageReactionRemove", async (reaction, user) => {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;
        if (!reaction.message.guild) return;

        console.log(`remove : ${user.id}`);

        if (reaction.message.channel.id == "904694895757889558") {
          console.log(`click`);
          if (reaction.emoji.name === `✅`) {
            console.log("remove check");
            reaction.message.guild.members.cache
              .get(user.id)
              .roles.remove(calendarRole);
          } else return;
        }
      });
    }
  }
});

client.login(token);
