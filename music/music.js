//TODO : 음악 기능
// 재생,정지,스킵,삭제,리스트,리스트 선택해서 삭제,랜덤 셔플

//! 현재 내가 음성 채널에 없음에도 음악이 재생되는 문제,
//! 음악 리스트가 추가된건지는 모르겠지만, 어쨌든 음원이 재생되지 않는 문제가 보여짐.

const ytdl = require("ytdl-core");
const yts = require("yt-search");

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");

const queue = new Map();

const musicOrder = async (message, songName) => {
  const voiceChannel = message.member.voice.channel.id;
  if (!voiceChannel)
    return message.channel.send("음악을 재생하려면 음성 채널에 있어야 합니다!");

  const connection = joinVoiceChannel({
    channelId: message.member.voice.channel.id,
    guildId: message.guild.id,
    adapterCreator: message.guild.voiceAdapterCreator,
  });

  const videoFinder = async (query) => {
    const videoResult = await yts(query);

    return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
  };

  const video = await videoFinder(songName);

  if (video) {
    const stream = ytdl(video.url, { filter: `audioonly` });

    const player = createAudioPlayer();
    const resource = createAudioResource(stream);

    const play = async () => {
      await player.play(resource);
      connection.subscribe(player);
    };

    await message.reply(`now playing ${video.title}`);
  } else {
    message.channel.send("영상을 찾지 못함.");
  }
};

module.exports = { musicOrder };

// const serverQueue = queue.get(message.guild.id);

// if (songName === "skip") {
//   skip(message, serverQueue);
//   return;
// } else if (songName === "stop") {
//   stop(message, serverQueue);
//   return;
// } else {
//   execute(songName, message, serverQueue);
// }
// };

// const execute = async (songName, message, serverQueue) => {
// const voiceChannel = message.member.voice.channel;

// if (!voiceChannel)
//   return message.channel.send(
//     "음악을 재생하려면 음성 채널에 입장해있어야 합니다!"
//   );

// const { videos } = await yts(songName);
// if (!videos.length)
//   return message.channel.sned("해당 곡을 찾을 수 없습니다!");

// const song = {
//   title: videos[0].title,
//   url: videos[0].url,
// };

// if (!serverQueue) {
//   const queueContruct = {
//     textChannel: message.textChannel,
//     voiceChannel: voiceChannel,
//     connection: null,
//     songs: [],
//     volume: 5,
//     playing: true,
//   };

//   queue.get(message.guild.id, queueContruct);

//   queueContruct.songs.push(song);

//   try {
// const connection = joinVoiceChannel({
//   channelId: message.member.voice.channel,
//   guildId: message.guild.id,
//   adapterCreator: message.guild.voiceAdapterCreator,
// });
//     queueContruct.connection = connection;
//     play(message.guild, queueContruct.songs[0]);
//   } catch (err) {
//     console.log(err);
//     queue.delete(message.guild.id);
//     return message.channel.send(err);
//   }
// } else {
//   serverQueue.songs.push(song);
//   return message.channel.send(`${song.title} 이 재생 됩니다.`);
// }
// };

// const skip = (message, serverQueue) => {
// if (!serverQueue) {
//   return message.channel.sned(`재생중인 노래가 없습니다!`);
// }

// serverQueue.connection.dispatcher.end();
// };

// const stop = (message, serverQueue) => {
// if (!message.member.voice.channel)
//   return message.channel.send(
//     "You have to be in a voice channel to stop the music!"
//   );

// if (!serverQueue)
//   return message.channel.send("There is no song that I could stop!");

// serverQueue.songs = [];
// serverQueue.connection.dispatcher.end();
// };

// const play = (guild, song) => {
// const serverQueue = queue.get(guild.id);
// if (!song) {
//   serverQueue.voiceChannel.leave();
//   queue.delete(guild.id);
//   return;
// }

// const dispatcher = serverQueue.connection
//   .play(ytdl(song.url))
//   .on("finish", () => {
//     serverQueue.songs.shift();
//     play(guild, serverQueue.songs[0]);
//   })
//   .on("error", (error) => console.error(error));
// dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
// serverQueue.textChannel.send(`Start playing: **${song.title}**`);
