const messages = require("../utils/messages");

module.exports = {
  description: "Descanso un rato",
  run: async (message, args, client) => {
    const player = client.riffy.players.get(message.guild.id);
    if (!player) return messages.error(message.channel, "No hay ningún temón sonando, wachín");
    if (player.paused)
      return messages.error(message.channel, "Ya está pausado, pa. No me hagás laburar de más");

    player.pause(true);
    messages.success(message.channel, "Pausé el temón. Voy a tomar un Fernet y vuelvo 🍹🎶");
  },
};
