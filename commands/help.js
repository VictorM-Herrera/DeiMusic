const messages = require("../utils/messages");

module.exports = {
  description: "Muestro los comandos",
  run: async (message, args, client) => {
    messages.help(message.channel);
  },
};
