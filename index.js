console.log(`Hello from Node.js ${process.version}!`);
const { Client, Message, MessageEmbed, WebhookClient, Collection , fs} = require("./start/dependencies");
require("./start/dependencies")
//require("./start/discordlogin");

const client = new Client({
    messageCacheLifetime: 60,
    fetchAllMembers: false,
    messageCacheMaxSize: 10,
    restTimeOffset: 0,
    restWsBridgetimeout: 100,
    shards: "auto",
    allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: true,
    },
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    intents: 32767,
});

const config = require("./settings/config.json");

client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.cooldowns = new Collection();
client.slashCommands = new Collection();
client.categories = fs.readdirSync("./commands/");

["command_handler", "slash_handler", "event_handler"].forEach((handler) => {
    require(`./handlers/${handler}`)(client)
 });

client.login(process.env.TOKEN);