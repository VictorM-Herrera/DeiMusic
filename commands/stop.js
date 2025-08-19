const messages = require("../utils/messages");

module.exports = {
  description: "Dejo de rapear, gil",
  run: async (message, args, client) => {
    const player = client.riffy.players.get(message.guild.id);
    if (!player) return messages.error(message.channel, "No hay ningún temón sonando, wachín");

    player.destroy();
    messages.success(
      message.channel,
      "Listo loco, corté la música y limpié la cola. ¡Todo piola ahora!"
    );
  },
};
