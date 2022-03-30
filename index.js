const { Client, Collection, Intents, MessageEmbed } = require("discord.js");

const { token, prefix } = require("./config.json");
const fs = require("fs");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

const client = new Client({
  disableEveryone: true,
  intents: [
    Intents.FLAGS.GUILDS, // GUILDS = server
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    "GUILDS",
    "GUILD_MESSAGES",
    "DIRECT_MESSAGES",
    "GUILD_VOICE_STATES",
  ],
  partials: ["CHANNEL", "MESSAGE", "REACTION"],
});

client.commands = new Collection();


// 아래 내용은 commands/ 에 들어있는 명령어들을 하나씩 뽑아내서 등록하는 절차.
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const loaCommandFiles = fs.readdirSync('./commands/lostark').filter(file => file.endsWith('.js'));
const musicCommandFiles = fs.readdirSync('./commands/music').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

for (const file of loaCommandFiles) {
	const loaCommand = require(`./commands/lostark/${file}`);
	client.commands.set(loaCommand.data.name, loaCommand);
}

for (const file of musicCommandFiles) {
	const musicCommand = require(`./commands/music/${file}`);
	client.commands.set(musicCommand.name, musicCommand);
}

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  emitAddSongWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin()]
});

module.exports = client;

// <!--  -->


client.once("ready", () => {
  console.log("믹스테잎 준비 완료");

  client.user.setPresence({
    activities: [{ name: "도움말은 /명령어" }],
  });
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

  // let testItem = interaction.slice(0,1);

  // console.log(`interaction: ${interaction}`);
  // console.log(`testItem: ${JSON.stringify(interaction.options._hoistedOptions[0]["value"])}`); //! 특정 커맨드 options를 가져오는 변수.

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on("messageCreate", async (message) => {
  const order = message.content.split(" ")[0];
  const orderWithOutPrefix = message.content.split(" ")[1];

  let json = JSON.parse(fs.readFileSync("./music/musicChannelList.json"));

  let musicChannelList = [];

  for (let i = 0; i < json.length; i++) {
    musicChannelList[i] = json[i];
  }

  //! 봇 메시지만 제외하고 콘솔에 찍는 기능.
  if (!message.author.bot) {
    console.log(message.data);
  }

  //! 봇 메시지가 아닌지 우선적으로 검사
  //! 이후 각 명령어에 따라서 각기 다른 결과 출력

  if (!musicChannelList.includes(message.channelId)) {
    if (!message.author.bot) {
      if (order === `!!!공지`) madeNotice(client, message);

      if (order === `!!!알람실행`) {
        alarmExeComment(message, client);
        loaAlarm(client);
      }

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
        let json = JSON.parse(fs.readFileSync("alarmData.json"));
        let channelList = [];
        for (let i = 0; i < json.length; i++) {
          channelList[i] = json[i]["channel"];
        }

        if (
          !message.guild.channels.cache.find(
            (channel) => channel.id == channelList
          )
        ) {
          channelID = await makeAlarmChannel(message);
          roleID = await makeRole(message);

          let idData = { channel: channelID, role: roleID };

          json.push(idData);

          fs.writeFileSync("alarmData.json", JSON.stringify(json), JSON);

          addRoleEmbed(message, client);
        } else {
          message.channel.send({ embeds: [alreadyMessage] });
        }
      }

      if (order === `${prefix}알람역할`) {
        addRoleEmbed(message, client);
      }

      if (order === `${prefix}사사게`) {
        watingMessage(message, orderWithOutPrefix.split("/")),
          sasagaeEmbed(message, orderWithOutPrefix, errorMessage);
      }

      if (order === `${prefix}음악세팅`) {
        if (
          !message.guild.channels.cache.find((channel) =>
            musicChannelList.includes(channel.id)
          )
        ) {
          channelID = await makeMusicChannel(message);

          musicChannelList.push(channelID);

          fs.writeFileSync(
            "./music/musicChannelList.json",
            JSON.stringify(musicChannelList),
            JSON
          );
        } else {
          message.channel.send({ embeds: [alreadyMessage] });
        }
      }
    }
  } else {
    if (!message.author.bot) {
      if (order === `${prefix}스킵`) {
        musicOrder(message, "skip");
      } else if (order === `${prefix}정지`) {
        musicOrder(message, "stop");
      } else {
        musicOrder(message, message.content);
        console.log(`test : ${message.content}`);
      }
    }
  }
});

client.login(token);
