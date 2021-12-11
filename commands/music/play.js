module.exports.run = async (client, message, args) => {
    const m = await message.channel.send('');
  };
  const Discord = require("discord.js");
  const { Message, Client, MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
  
  module.exports = {
      name: "play",
      aliases: ["back", "loop", "volume", "ping", "pause", "resume", "stop", "queue", "help", "skip"],
      category: "others",
      run: async (client, message, args) => {
        return;//console.log("Comando index.js")
      }
    }