const messages = require("../utils/messages");

module.exports = {
  description: "Te muestro la lista de canciones",
  run: async (message) => {
    const player = client.riffy.players.get(message.guild.id);
    if (!player) return messages.error(message.channel, "No hay ningún temón sonando, wachín");
    const queue = player.queue;
    if (!queue.length && !player.queue.current) {
      return messages.error(
        message.channel,
        "La cola está vacía, maestro. Tirame un tema con el comando -play 🎵"
      );
    }
    messages.queueList(message.channel, queue, player.queue.current);
  },
};
