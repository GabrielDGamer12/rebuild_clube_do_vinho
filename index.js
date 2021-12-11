console.log(`Hello from Node.js ${process.version}!`);
const { Client, Message, MessageEmbed, WebhookClient, Collection , fs} = require("./start/dependencies"); // Dependencias Principais
const config = require("./settings/config.json");
const { client } = require("./start/client");
require("./start/dependencies"); // Dependencias Principais
require('dotenv').config()
require("./modules/music") // Comandos de Música

module.exports = client;

//  HANDLER //

client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.cooldowns = new Collection();
client.slashCommands = new Collection();
client.categories = fs.readdirSync("./commands/");

["command_handler", "event_handler", "slash_handler"].forEach((handler) => {
   require(`./handlers/${handler}`)(client)
});

//  HANDLER //

client.login(process.env.TOKEN);