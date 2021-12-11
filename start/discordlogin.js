const fs = require('fs');
const { prefix } = require("../settings/config.json");
const { client } = require("./client");
const { Discord } = require("./dependencies");

/*client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.cooldowns = new Collection();
client.slashCommands = new Collection();*/
//client.categories = fs.readdirSync(".././commands/");

["command_handler", "event_handler", "slash_handler"].forEach((handler) => {
   require(`../handlers/${handler}`)(client)
});

client.login("Nzk4OTkzNDUxNzkzNTE0NDk2.X_9Gow.3hwHe8q3W0A84R1_etirO9L5mV4");