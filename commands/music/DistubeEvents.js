const client = require("../../index.js");
const { MessageEmbed } = require("discord.js");


//TODO : 공식문서에 사용되는 형식으로 리팩토링 필요.
const status = queue =>
  `Filter: \`${queue.filters.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send({embeds: [new MessageEmbed()
        .setColor("#8B00FF")
        .setDescription(
          `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
            song.user
          }\n${status(queue)}`
        )]})
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      {embeds: [new MessageEmbed()
        .setColor("#8B00FF")
        .setDescription(
          `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
        )]}
      )
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      {embeds: [new MessageEmbed()
        .setColor("#8B00FF")
        .setDescription(
          `Added \`${playlist.name}\` playlist (${
            playlist.songs.length
          } songs) to queue\n${status(queue)}`
        )]}
      )
  )
  .on('error', (channel, e) => {
    channel.send(`An error encountered: ${e.toString().slice(0, 1974)}`)
    console.error(e)
  })
  .on('empty', channel => channel.send('Voice channel is empty! Leaving the channel...'))
  .on('searchNoResult', (message, query) =>
    message.channel.send(`No result found for \`${query}\`!`)
  )
  .on('finish', queue => queue.textChannel.send('Finished!'))