const { Client, Events, GatewayDispatchEvents } = require("discord.js");
const { Riffy } = require("riffy");
const { Spotify } = require("riffy-spotify");
const config = require("./utils/config");
const messages = require("./utils/messages");
require("dotenv").config();
const token = process.env.TOKEN;
//creacion de nuevo cliente
const client = new Client({
  // intents: 53608447,
  intents: [
    "Guilds",
    "GuildMessages",
    "GuildVoiceStates",
    "GuildMessageReactions",
    "MessageContent",
    "DirectMessages",
  ],
});

const spotify = new Spotify({
  clientId: config.spotify.clientId,
  clientSecret: config.spotify.clientSecret
});

client.riffy = new Riffy(client, config.nodes, {
  send: (payload) => {
    const guild = client.guilds.cache.get(payload.d.guild_id);
    if (guild) guild.shard.send(payload);
  },
  defaultSearchPlataform: "ytmsearch",
  restVersion: "v4",
  plugins: [spotify]
});


//creacion de evento
client.on(Events.ClientReady, async () => {
  client.riffy.init(client.user.id);
  console.log(`Conectado como ${client.user.username}!`);
});

//respuestas a mensajes
// client.on(Events.MessageCreate, async (message) =>{
//     if(message.author.bot) return;//si el mensaje lo envia un bot que no responda
//     if(!message.content.startsWith('-')) return;

//     const arg = message.content.slice(1)//creo el argumento sin contar el "-"
//     if (arg === "hola") message.reply("Buenos Dias!")
// })

//respuestas con Command Handler
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith("-")) return;
  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  try {
    const command = require(`./commands/${commandName}`);
    command.run(message, args, client);
  } catch (error) {
    console.log(
      `Ha ocurrido un error al utilizar el comando -${commandName}`,
      error.message
    );
  }
});
client.riffy.on("nodeConnect", (node) => {
    console.log(`Conectado al nodo "${node.name}".`);
});
client.riffy.on("nodeError", (node, error) => {
    console.log(`Se encontro un error en el nodo: "${node.name}", error: ${error.message}.`);
});
client.riffy.on("trackStart", async (player, track) => {
    const channel = client.channels.cache.get(player.textChannel);
    messages.nowPlaying(channel, track);
});
client.riffy.on("queueEnd", async (player) => {
    const channel = client.channels.cache.get(player.textChannel);
    player.destroy();
    messages.queueEnded(channel);
});
client.on("raw", (d) => {
    if (![GatewayDispatchEvents.VoiceStateUpdate, GatewayDispatchEvents.VoiceServerUpdate].includes(d.t)) return;
    client.riffy.updateVoiceState(d);
});
//cada que se una un usuario al servidor
client.on(Events.GuildMemberAdd, async (member) => {
  const welcomeChannelId = "693244616581054554";
  const channel = await client.channels.fetch(welcomeChannelId);

  channel.send(
    `**<@${member.user.id}> bienvenido a la comunidad diamantito!** ✌️💎`
  );
});

client.login(`${token}`);
