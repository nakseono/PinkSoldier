const fs = require('node:fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildIds, token } = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const loaCommandFiles = fs.readdirSync('./commands/lostark').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

for (const file of loaCommandFiles) {
	const loaCommand = require(`./commands/lostark/${file}`);
	commands.push(loaCommand.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async() => {
  guildIds.map(async (guildId) => {
    try {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });
      console.log(`${guildId} 서버 명령어 배포 완료.`);
      // console.log(commands);
    } catch(err) {
      console.error(err)
    }
  })
})();

//! 글로벌 명령어 배포 코드 - 개발할 때에는 사용 X
// try {
//   await rest.put(Routes.applicationCommands(clientId), {
//     body: commands,
//   });
//   console.log(`글로벌 명령어 배포 완료.`)
// } catch(err) {
//   console.error(err);
// }