const { Client, Message, MessageEmbed, Collection, WebhookClient, fs } = require("../start/dependencies");

const { collectionMusic } = require("../start/mongologin")

const Distube = require('distube').default;
const SpotifyPlugin = require("@distube/spotify").default;
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { RepeatMode } = require("distube");

const config = require("../settings/config.json")

const { client } = require("../start/client");

console.log("Music Carregado")

console.log("Prefixo: " + config.prefix)

const distube = new Distube(client, {
  searchSongs: 7,
  emitNewSongOnly: false,
  plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],
});

client.on('ready', () => {
  console.log('Tocando Músicas ...');

  distube.on('error', (channel, error) =>
    channel.send('Ocorreu um erro: ' + error)
  );
});

const status = (queue) =>
  `Volume: ${queue.volume}% | Filter: ${
    queue.filters.join(', ') || 'Off'
  } | Loop: ${
    queue.repeatMode
      ? queue.repeatMode === 1
        ? 'Toda a Playlist'
        : 'Essa Música'
      : 'Off'
  } | Autoplay: ${queue.autoplay ? 'On' : 'Off'}`;

  distube
  .on('playSong', async(queue, song) => { 
    const filteredDocsStart = (await collectionMusic.find({}, { projection: { _id: 0, volume: 1 } }).toArray());
    distube.setVolume(queue, Number(filteredDocsStart[0].volume));
    const filteredDocsLoop_preload = await collectionMusic.find({}, { projection: { _id: 0, loop: 1 } }).toArray();
    distube.setRepeatMode(queue, parseInt(filteredDocsLoop_preload[0].loop));
    let playEmbed = new MessageEmbed()
      .setColor('#FFA400')
      .setTitle(`🎵 Tocando `)
      .setThumbnail(song.thumbnail)
      .setDescription(`[${song.name}](${song.url})`)
      .addField('Pedido por', `${song.user}`, true)
      .addField('Duração', `${song.formattedDuration.toString()}`, true)
      .setFooter(status(queue), song.user.displayAvatarURL({ dynamic: true }));

    queue.textChannel.send({ embeds: [playEmbed] });
  })
  .on('addSong', async(queue, song) => {
    let playEmbed = new MessageEmbed()
      .setColor('#FFA400')
      .setTitle(`🎵 Adicionada a Fila`)
      .setThumbnail(song.thumbnail)
      .setDescription(`[${song.name}](${song.url})`)
      .addField('Pedido por', `${song.user}`, true)
      .addField('Duração', `${song.formattedDuration.toString()}`, true)
      .setFooter('', song.user.displayAvatarURL({ dynamic: true }));

    queue.textChannel.send({ embeds: [playEmbed] });
  })
  .on('addList', async(queue, playlist) => {
    let embed = new Embed()
    .setDescription(`A playlist \`${playlist.name}\` foi adicionada (${playlist.songs.length} músicas) para a fila\n${status(queue)}`)
    queue.textChannel.send({embeds: [embed]})
  })
    .on("searchInvalidAnswer", (message) => {
      let embed = new MessageEmbed()
      .setDescription("Sua resposta é um número inválido")
      message.channel.send({embeds: [embed]})
    })
  .on("searchCancel", (message) => {
    let embed = new MessageEmbed()
    .setDescription("Pesquisa Cancelada")
    message.channel.send({embeds: [embed]})
  })
  .on("searchNoResult", (message, query) => message.channel.send(`Nenhum resultado encontrado para: ${query}!`))
  .on("searchResult", (message, results) => {
    fs.writeFile("listplay.txt", (results.map((song, i) => `${song.name}`)).join("\n").toString(), function (err,data) {
      if (err) {
        return console.log(err);
      }
    })
    let embed = new MessageEmbed()
    .addField("Escolha uma das opções Abaixo:", ` \n${results.map((song, i) => `**${i + 1}**. **:small_blue_diamond: ${song.name}** - \`${song.formattedDuration}\``).join("\n")}\n\n***Digite alguma coisa ou espere 60 segundos para cancelar***`)
    message.channel.send({embeds: [embed]});
})
.on("searchDone", (message, query, results) => {
  function get_line(filename, line_no, callback) {
    var stream = fs.createReadStream(filename, {
      flags: 'r',
      encoding: 'utf-8',
      fd: null,
      mode: 0666,
      bufferSize: 64 * 1024
    });
 
    var fileData = '';
    stream.on('data', function(data){
      fileData += data;
 
      var lines = fileData.split("\n");
 
      if(lines.length >= +line_no){
        stream.destroy();
        callback(null, lines[+line_no]);
      }
    });
 
    stream.on('error', function(){
      callback('Error', null);
    });
 
    stream.on('end', function(){
      callback('File end reached without finding line', null);
    });
 
}
 
get_line('./listplay.txt', query.toString() - 1, function(err, line){  
  let embed = new MessageEmbed()
  .setDescription(`Adicionando **${line}** à fila.`)
    message.channel.send({embeds: [embed]})
})
});
// *************************************************************************************

client.on('messageCreate', async (message, song) => {
  const configdb = await collectionMusic.find({}).toArray();
  if (
    !message.guild ||
    message.author.bot ||
    !message.content.startsWith(config.prefix || configdb[0].extraprefix)
  )
    return;

  let args = message.content.slice(config.prefix.length || configdb[0].extraprefix.length).trim().split(' ');
  let cmd = args.shift()?.toLowerCase();

  if (cmd === 'ping') {
    message.channel.send(`>>> Ping :- \`${client.ws.ping}\``);
  } else if (cmd === 'play') {
    let search = args.join(' ');
    let channel = message.member.voice.channel;

    if (!channel) {
      message.react('🙄');
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor('#FFA400')
            .setDescription(`>>> Por Favor entre em um canal de Voz`)
            .setFooter(
              `${message.author.username}`,
              message.author.displayAvatarURL({ dynamic: true })
            ),
        ],
      });
    }

    if (!search) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor('#FFA400')
            .setDescription(`>>> Por Favor coloque o **nome da música** ou o **link**`)
            .setFooter(
              `${message.author.username}`,
              message.author.displayAvatarURL({ dynamic: true })
            ),
        ],
      });
    } else {
        if(search.includes("/playlist?list=")) {
          message.react('🥰');
          distube.play(message, search);
        } else {
          if(search.includes("youtube.com/watch?v=")) {
            let rul = (search.split("youtube.com/watch?v=")[1])
            var fetchVideoInfo = require('youtube-infofix');
              fetchVideoInfo(rul).then(function (videoInfo) {
                if(videoInfo.duration == 0) {
                  return message.reply(`Não é possivel reproduzir Lives`);
                } else {
                  message.react('🥰');
                  distube.play(message, search);
                }
                });
          } else {
            if(search.includes("youtu.be/")) {
              let rul = (search.split("https://youtu.be/")[1])
              var fetchVideoInfo = require('youtube-infofix');
                fetchVideoInfo(rul).then(function (videoInfo) {
                  if(videoInfo.duration == 0) {
                    return message.reply(`Não é possivel reproduzir Lives`);
                  } else {
                    message.react('🥰');
                    distube.play(message, search);
                  }
                  });
            } else {
              message.react('🥰');
              distube.play(message, search);
            }             
          }
        }
    }

    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }
    
  } else if (cmd === 'skip') {
    let queue = distube.getQueue(message.guildId);

    if (!message.guild.me.voice.channel) {
      return message.reply(`>>> Nada Tocando 😶`);
    }
    if (!queue) {
      return message.reply(`>>> Nada Tocando 😶`);
    } else {
      if(queue.songs.length == 1) {
        let embed = new MessageEmbed()
        .setDescription(`>>> Nada Tocando 😶`)
        return message.reply({embeds: [embed]}) && queue.stop();
      } else {
        let embed = new MessageEmbed()
        .setDescription(`>>> Pulada`)
        return message.reply({embeds: [embed]}) && queue.skip();
      }
    }    
  }
  if (cmd === 'volume') {
    if (args[0] != null) {
      if (args[0].length >= 0) {
        if ((args[0].replace(/[^0-9]/g,'')) <= 0  || (args[0].replace(/[^0-9]/g,'')) <= 200) {
          let queue = distube.getQueue(message.guildId);
          if (!queue) {
            message.channel.send('Nada tocando agora!');
          } else {
            let volume_number = (args[0]).replace(/[^0-9]/g,'');
            const filteredDocs = (await collectionMusic.find({}, { projection: { _id: 0, volume: 1 } }).toArray());    
            collectionMusic.updateOne({ volume: filteredDocs[0].volume }, { $set: { volume: volume_number } });
            await sleep(1000);
            const filteredDocs2 = (await collectionMusic.find({}, { projection: { _id: 0, volume: 1 } }).toArray());
            message.channel.send("Volume Atual: " + volume_number + "%");
            distube.setVolume(message, Number(filteredDocs2[0].volume))
          }
        } else {
          const filteredDocs2 = (await collectionMusic.find({}, { projection: { _id: 0, volume: 1 } }).toArray());
          let embed = new MessageEmbed()
            .setDescription("Só é possivel colocar o volume de \`0%\` à \`200%\`\n\nVolume Atual: \`" + filteredDocs2[0].volume + "%\`")
          message.channel.send({embeds: [embed]})
        }
      } else {
        const filteredDocs2 = (await collectionMusic.find({}, { projection: { _id: 0, volume: 1 } }).toArray()); 
        let embed = new MessageEmbed()
          .setDescription("Só é possivel colocar o volume de \`0%\` à \`200%\`\n\nVolume Atual: \`" + filteredDocs2[0].volume + "%\`")
        message.channel.send({embeds: [embed]})
      }
    } else {
      const filteredDocs2 = (await collectionMusic.find({}, { projection: { _id: 0, volume: 1 } }).toArray()); 
      let embed = new MessageEmbed()
        .setDescription("Só é possivel colocar o volume de \`0%\` à \`200%\`\n\nVolume Atual: \`" + filteredDocs2[0].volume + "%\`")
      message.channel.send({embeds: [embed]})
    }
    const queue = distube.getQueue(message.guildId);
    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }
  }

  if (cmd === 'stop') {
    const queue = distube.getQueue(message.guildId);
    if(!queue) {
      let embed = new MessageEmbed()
        .setDescription(`>>> Nada Tocando 😶`)
        return message.reply({embeds: [embed]});
    } else {
      distube.stop(message);
      message.channel.send('Música parada!');
    }
  }

  if (cmd === 'resume') {
    const queue = distube.getQueue(message.guildId);
    if(!queue) {
      let embed = new MessageEmbed()
        .setDescription(`>>> Nada Tocando 😶`)
        return message.reply({embeds: [embed]});
    } else {
      if(queue.playing == false) {
        distube.resume(message);
        let embed = new MessageEmbed()
        .setDescription(`Música Retomada.`)
        return message.reply({embeds: [embed]});
      } else {
        let embed = new MessageEmbed()
        .setDescription(`A Música não está pausada.`)
        return message.reply({embeds: [embed]});
      }
      //
    }
  }

  if (cmd === 'pause') {
    const queue = distube.getQueue(message.guildId);
    if(!queue) {
      let embed = new MessageEmbed()
        .setDescription(`>>> Nada Tocando 😶`)
        return message.reply({embeds: [embed]});
    } else {
      if(queue.paused == true) {
        let embed = new MessageEmbed()
        .setDescription(`>>> A Música já está Pausada 😶`)
        return message.reply({embeds: [embed]});
      } else {
        distube.pause(message);
        let embed = new MessageEmbed()
        .setDescription(`Música Pausada.`)
        return message.reply({embeds: [embed]});
      }
    }
  }

  if (cmd === 'help') {
    let embed = new MessageEmbed()
    .setDescription(`
    **+play** [Toca uma música].
  **+back** [Volta para Música anterior].
  **+skip** [Pula a Música atual].
  **+queue** [Veja a fila de Músicas].
  **+help**  [Todos os Comandos].
  **+stop** [Para a Música e sai da Chamada].
  **+resume** [Retoma a Música].
  **+pause** [Pausa a Música].`)
    return message.reply({embeds: [embed]});
  }
  if (cmd === 'back') {
    const queue = distube.getQueue(message.guildId);
    if(!queue) {
      let embed = new MessageEmbed()
      .setDescription(`>>> Nada Tocando 😶`)
      return message.reply({embeds: [embed]});
    } else {      
      if(queue.previousSongs.length == 0) {
        let embed = new MessageEmbed()
        .setDescription(`>>> Nada Tocando 😶`)
        return message.reply({embeds: [embed]})
      } else {
        queue.previous()
      }
    }
  }

  if (cmd === 'queue') {
    const queue = distube.getQueue(message.guildId);

    if (!queue) {
      let embed = new MessageEmbed()
      .setDescription(`>>> Nada Tocando agora! 😶`)
      return message.reply({embeds: [embed]});
    } else {
      const descricaoqueue = (queue.songs
        .map(
          (song, id) =>
            `**${id ? id : 'Tocando'}**. ${song.name} - \`${
              song.formattedDuration
            }\``
        )
        .slice(0, 16)
        .join('\n'))
        
        let totalSeconds2 = queue.currentTime / 1;
        let days2 = Math.floor(totalSeconds2 / 86400);
        let hours2 = Math.floor(totalSeconds2 / 3600);
        totalSeconds2 %= 3600;
        let minutes2 = Math.floor(totalSeconds2 / 60);
        let seconds2 = totalSeconds2 % 60;

        let totalSeconds = queue.duration / 1;
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
          if(days.toFixed() > 0) {
          let currenttime = (`${days2.toFixed()} dias, ${hours2.toFixed()} horas, ${minutes2.toFixed()} minutos, ${seconds2.toFixed()} segundos`)
          let totaltime = (`${days.toFixed()} dias, ${hours.toFixed()} horas, ${minutes.toFixed()} minutos, ${seconds.toFixed()} segundos`)
          const embed = new MessageEmbed()
          .setTitle("Fila atual:")
          .setDescription(descricaoqueue)
          .setFooter("|            Tempo Atual            |            Tempo Total            |\n" + "|  " + currenttime + "   |   " + totaltime + "  |")
          message.channel.send({embeds: [embed]})
        } else {
          if(hours.toFixed() > 0) {
            let totaltime = (`${hours.toFixed()} horas, ${minutes.toFixed()} minutos, ${seconds.toFixed()} segundos`)
            let currenttime = (`${hours2.toFixed()} horas, ${minutes2.toFixed()} minutos, ${seconds2.toFixed()} segundos`)
            const embed = new MessageEmbed()
            .setTitle("Fila atual:")
            .setDescription(descricaoqueue)
            .setFooter("|                    Tempo Atual                    |                    Tempo Total                    |\n" + "|  " + currenttime + "   |   " + totaltime + "  |")
            message.channel.send({embeds: [embed]})
          } else {
            if(minutes.toFixed() > 0) {
              let currenttime = (`${minutes2.toFixed()} minutos, ${seconds2.toFixed()} segundos`)
              let totaltime = (`${minutes.toFixed()} minutos, ${seconds.toFixed()} segundos`)
              const embed = new MessageEmbed()
              .setTitle("Fila atual:")
              .setDescription(descricaoqueue)
              .setFooter("|            Tempo Atual            |            Tempo Total            |\n" + "|  " + currenttime + "   |   " + totaltime + "  |")
              message.channel.send({embeds: [embed]})
            } else {
              let currenttime = (`${seconds2.toFixed()} segundos`)
              let totaltime = (`${seconds.toFixed()} segundos`)
              const embed = new MessageEmbed()
              .setTitle("Fila atual:")
              .setDescription(descricaoqueue)
              .setFooter("|   Tempo Atual   |   Tempo Total   |\n" + "|    " + currenttime + "     |     " + totaltime + "    |")
              message.channel.send({embeds: [embed]})
            }
        }}
    }
  }
});

client.on('message', async(message) => {
  if (!message.content.startsWith(config.prefix)) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift();
  if (command == "loop") {
    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }
    const queue = distube.getQueue(message.guildId);
    if (args[0] != null) {
      if ((args[0].replace(/[^0-9]/g,'')) <0  || (args[0].replace(/[^0-9]/g,'')) > 2) {
        const cmdloop = `${prefix}loop`
        const collectionMusic = clientDB.db("cdvDB").collection("cdvMusic");
        const filteredDocsLoop = await collectionMusic.find({}, { projection: { _id: 0, loop: 1 } }).toArray();
        const embed = new MessageEmbed()
          .setTitle("Modo Loop")
          .setColor("#FF0000")
          .addField("Status: ", filteredDocsLoop[0].loop)
          .addField("Modo de Usar:", `**${cmdloop} 0 = Desligado\n${cmdloop} 1 = Música\n${cmdloop} 2 = Playlist**`)
  
          message.channel.send("Formato Incorreto!");
          message.channel.send({embeds: [embed]});
      } else {
        if (!queue) {
          let embed = new MessageEmbed()
        .setDescription(`>>> Nada Tocando 😶`)
        return message.reply({embeds: [embed]});
        } else {
          const filteredDocsLoop_preload = await collectionMusic.find({}, { projection: { _id: 0, loop: 1 } }).toArray();
          await sleep(1000);
          collectionMusic.updateOne({ loop: filteredDocsLoop_preload[0].loop }, { $set: { loop: args[0] } })
          await sleep(1000);
          let mode = distube.setRepeatMode(message, parseInt(filteredDocsLoop_preload[0].loop));
          mode = mode ? mode == 2 ? "Repetindo a Playlist" : "Repetindo a Música" : "Desligado";
          let embed = new MessageEmbed()
        .setDescription(`Modo Loop: ` + mode)
        return message.reply({embeds: [embed]});
        }          
    }
  } else {
        const cmdloop = `${prefix}loop`
        const collectionMusic = clientDB.db("cdvDB").collection("cdvMusic");
        const filteredDocsLoop = await collectionMusic.find({}, { projection: { _id: 0, loop: 1 } }).toArray();
        const embed = new MessageEmbed()
          .setTitle("Modo Loop")
          .setColor("#FF0000")
          .addField("Status: ", filteredDocsLoop[0].loop)
          .addField("Modo de Usar:", `**${cmdloop} 0 = Desligado\n${cmdloop} 1 = Música\n${cmdloop} 2 = Playlist**`)

        message.channel.send({embeds: [embed]});
    }
}});