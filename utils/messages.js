const { EmbedBuilder } = require("discord.js");
const config = require("./config.js");
const emojis = require("./emojis.js");

const commands = [
    { name: 'play <query>', description: 'Te rapeo un tema que me pidas, wachín' },
    { name: 'pause', description: 'Me detengo un toque, estoy cansado' },
    { name: 'resume', description: 'Sigo rapeando como si nada hubiera pasado' },
    { name: 'skip', description: 'Pasamos al siguiente temón' },
    { name: 'stop', description: 'Corto la música y me rajo' },
    { name: 'queue', description: 'Te muestro la listita de temones que vienen' },
    // { name: 'nowplaying', description: 'Te digo qué está sonando ahora, papá' },
    // { name: 'volume <0-100>', description: 'Le subo o bajo el volumen, decime cuánto' },
    // { name: 'shuffle', description: 'Mezclo todo como DJ en la matinee' }, HACER
    { name: 'loop', description: 'Repite la cola como disco rayado' },
    // { name: 'remove <position>', description: 'Saco un tema de la cola, si no te gustó' }, HACER
    // { name: 'clear', description: 'Limpio toda la lista, no quedó nada' }, HACER
    // { name: 'status', description: 'Te digo cómo ando, si estoy sonando o esperando' }, HACER
    { name: 'help', description: 'Te tiro la posta con los comandos disponibles' }
];



function formatDuration(ms) {
  // Return 'LIVE' for streams
  if (!ms || ms <= 0 || ms === "Infinity") return "LIVE";

  // Convert to seconds
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  // Format based on length
  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function getDurationString(track) {
  if (track.info.isStream) return "LIVE";
  if (!track.info.duration) return "N/A";
  return formatDuration(track.info.duration);
}

module.exports = {
  success: (channel, message) => {
    return channel.send(`${emojis.success} | ${message}`); // Lo manejás desde el mensaje
  },

  error: (channel, message) => {
    return channel.send(`${emojis.error} | ${message}`); // También
  },

  nowPlaying: (channel, track) => {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle(`${emojis.music} Reproduciendo ahora, pa!`)
      .setDescription(`[${track.info.title}](${track.info.uri})`);

    if (track.info.thumbnail && typeof track.info.thumbnail === "string") {
      embed.setThumbnail(track.info.thumbnail);
    }

    embed
      .addFields([
        {
          name: "Artista",
          value: `${emojis.info} ${track.info.author}`,
          inline: true,
        },
        {
          name: "Duración",
          value: `${emojis.time} ${getDurationString(track)}`,
          inline: true,
        },
        {
          name: "Pedido por",
          value: `${emojis.info} ${track.info.requester.tag}`,
          inline: true,
        },
      ])
      .setFooter({ text: "Usá -help pa ver los comandos" });

    return channel.send({ embeds: [embed] });
  },

  addedToQueue: (channel, track, position) => {
    console.log(track);
    console.log(track.info);
    
    
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setDescription(
        `${emojis.success} Temón agregado a la cola: [${track.info.title}](${track.info.uri})`
      );

    if (track.info.thumbnail && typeof track.info.thumbnail === "string") {
      embed.setThumbnail(track.info.thumbnail);
    }

    embed.addFields([
      {
        name: "Artista",
        value: `${emojis.info} ${track.info.author}`,
        inline: true,
      },
      {
        name: "Duración",
        value: `${emojis.time} ${getDurationString(track)}`,
        inline: true,
      },
      { name: "Posición", value: `${emojis.queue} #${position}`, inline: true },
    ]);

    return channel.send({ embeds: [embed] });
  },

  addedPlaylist: (channel, playlistInfo, tracks) => {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle(`${emojis.success} Alta playlist agregada`)
      .setDescription(`**${playlistInfo.name}**`);

    if (playlistInfo.thumbnail && typeof playlistInfo.thumbnail === "string") {
      embed.setThumbnail(playlistInfo.thumbnail);
    }

    const totalDuration = tracks.reduce((acc, track) => {
      if (!track.info.isStream && track.info.duration) {
        return acc + track.info.duration;
      }
      return acc;
    }, 0);

    embed
      .addFields([
        {
          name: "Temas",
          value: `${emojis.queue} ${tracks.length} temas`,
          inline: true,
        },
        {
          name: "Duración total",
          value: `${emojis.time} ${formatDuration(totalDuration)}`,
          inline: true,
        },
        {
          name: "Streams",
          value: `${emojis.info} ${
            tracks.filter((t) => t.info.isStream).length
          } en vivo`,
          inline: true,
        },
      ])
      .setFooter({ text: "Ya arranca la playlist, calmate wachín" });

    return channel.send({ embeds: [embed] });
  },

  queueEnded: (channel) => {
    return channel.send(
      `${emojis.info} | Se terminó la joda. Me voy del canal de voz, culiáu.`
    );
  },

  queueList: (
    channel,
    queue,
    currentTrack,
    currentPage = 1,
    totalPages = 1
  ) => {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle(`${emojis.queue} Lista de temones`);

    if (currentTrack) {
      embed.setDescription(
        `**Sonando ahora:**\n${emojis.play} [${currentTrack.info.title}](${
          currentTrack.info.uri
        }) - ${getDurationString(currentTrack)}\n\n**Lo que sigue:**`
      );

      if (
        currentTrack.info.thumbnail &&
        typeof currentTrack.info.thumbnail === "string"
      ) {
        embed.setThumbnail(currentTrack.info.thumbnail);
      }
    } else {
      embed.setDescription("**Temas en cola:**");
    }

    if (queue.length) {
      const tracks = queue
        .map(
          (track, i) =>
            `\`${(i + 1).toString().padStart(2, "0")}\` ${emojis.song} [${
              track.info.title
            }](${track.info.uri}) - ${getDurationString(track)}`
        )
        .join("\n");

      embed.addFields({ name: "\u200b", value: tracks });

      const totalDuration = queue.reduce((acc, track) => {
        if (!track.info.isStream && track.info.duration) {
          return acc + track.info.duration;
        }
        return acc;
      }, 0);

      const streamCount = queue.filter((t) => t.info.isStream).length;
      const durationText =
        streamCount > 0
          ? `Duración total: ${formatDuration(
              totalDuration
            )} (${streamCount} en vivo)`
          : `Duración total: ${formatDuration(totalDuration)}`;

      embed.setFooter({
        text: `Total de temas: ${queue.length} • ${durationText} • Página ${currentPage}/${totalPages}`,
      });
    } else {
      embed.addFields({
        name: "\u200b",
        value: "No hay temas en cola, pedime uno wachín",
      });
      embed.setFooter({ text: `Página ${currentPage}/${totalPages}` });
    }

    return channel.send({ embeds: [embed] });
  },

  playerStatus: (channel, player) => {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle(`${emojis.info} Estado del reproductor`)
      .addFields([
        {
          name: "Estado",
          value: player.playing
            ? `${emojis.play} Sonando`
            : `${emojis.pause} Pausado`,
          inline: true,
        },
        {
          name: "Volumen",
          value: `${emojis.volume} ${player.volume}%`,
          inline: true,
        },
        {
          name: "Modo loop",
          value: `${emojis.repeat} ${
            player.loop === "queue" ? "Repite la cola" : "Desactivado"
          }`,
          inline: true,
        },
      ]);

    if (player.queue.current) {
      const track = player.queue.current;
      embed.setDescription(
        `**Sonando ahora:**\n${emojis.music} [${track.info.title}](${track.info.uri})\n` +
          `${emojis.time} Duración: ${getDurationString(track)}`
      );

      if (track.info.thumbnail && typeof track.info.thumbnail === "string") {
        embed.setThumbnail(track.info.thumbnail);
      }
    }

    return channel.send({ embeds: [embed] });
  },

  help: (channel) => {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle(`${emojis.info} Comandos disponibles`)
      .setDescription(
        commands
          .map((cmd) => `${emojis.music} \`${cmd.name}\` - ${cmd.description}`)
          .join("\n")
      )
      .setFooter({ text: "Usá el prefijo - • Ej: -play despacito" });
    return channel.send({ embeds: [embed] });
  },
};
