const messages = require("../utils/messages");

module.exports = {
  description: "Repito la lista wachin",
  run: async (message, args, client) => {
    const player = client.riffy.players.get(message.guild.id);
    if (!player)
      return messages.error(
        message.channel,
        "No hay ningún temón sonando, loco"
      );

    // Veo cómo está el loop y lo cambio
    const currentMode = player.loop;
    const newMode = currentMode === "none" ? "queue" : "none";

    player.setLoop(newMode);
    messages.success(
      message.channel,
      `${
        newMode === "queue"
          ? "Activé el modo loop, se repite la joda 🔁"
          : "Desactivé el loop, ahora seguimos normal 🚫"
      }`
    );
  },
};
