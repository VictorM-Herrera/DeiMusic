const messages = require("../utils/messages");

module.exports = {
  description: "Me pongo a rapear un tema de yt o spotify",
  run: async (message, args, client) => {
    if (!message.member.voice.channel) {
      return messages.error(
        message.channel,
        "Para poder rapear tenes que estar en un canal de voz, culiáu"
      );
    }
    const query = args.join(" ");
    if (!query)
     return messages.error(
        message.channel,
        "Pero decime el nombre, o pasame un enlace boludo"
      );

    try {
      const player = client.riffy.createConnection({
        guildId: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        deaf: true,
      });

      const resolve = await client.riffy.resolve({
        query: query,
        requester: message.author,
      });
      const { loadType, tracks, playlistInfo } = resolve;

      if (loadType === "playlist") {
        for (const track of tracks) {
          track.info.requester = message.author;
          player.queue.add(track);
        }

        messages.addedPlaylist(message.channel, playlistInfo, tracks);
        if (!player.playing && !player.paused) {
            console.log("intentando reproducir");
          return player.play();
        }
      }else if(loadType === "search" || loadType === "track"){
        const track = tracks.shift();
        track.info.requester = message.author;
        const position = player.queue.length + 1;
        player.queue.add(track);

        messages.addedToQueue(message.channel, track, position);
        if (!player.playing && !player.paused) {
            console.log("intentando reproducir");
            
            return player.play();
        }
      }else{
        return messages.error(message.channel, "No encontre nada che");
      }
    } catch (error) {
      console.log(error);
      return messages.error(message.channel, "Se me trabo el paty.");
    }
  },
};
