module.exports = {
  description: "Vuelvo de la pausa",
  run: async (message) => {
    const player = client.riffy.players.get(message.guild.id);
    if (!player)
      return messages.error(
        message.channel,
        "No hay ningún temón sonando, ¿qué querés que retome?"
      );

    if (!player.paused)
      return messages.error(
        message.channel,
        "Ya está sonando, no me apurés que me mareás"
      );

    player.pause(false);
    messages.success(
      message.channel,
      "Volvimos al ritmo, papá 🎤🔥 ¡Seguimos rapeando!"
    );
  },
};
