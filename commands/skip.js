const messages = require("../utils/messages");

module.exports = {
    description: 'Pasamos al siguiente temón',
     run: async (message, args, client) => {
        const player = client.riffy.players.get(message.guild.id);
            if (!player) return messages.error(message.channel, "No estoy rapeando nada, gilazo");
            if (!player.queue.length) return messages.error(message.channel, "No hay más temones pa' pasar, agregá alguno vo'");
            
            player.stop();
            messages.success(message.channel, "Listo loco, pasé al siguiente track como un campeón");
     }
}