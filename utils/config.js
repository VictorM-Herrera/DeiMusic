require("dotenv").config();
module.exports = {
    prefix: '-',
    nodes: [{
        host: "lavalink.jirayu.net",
        password: process.env.LAVALINK_PASSWORD,
        port: 13592,
        secure: false,
        name: "Main Node"
    }],
    spotify: {
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET
    },
    botToken: process.env.TOKEN,
    embedColor: "#0061ff"
};