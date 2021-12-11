const Discord = require("discord.js");
const { collectionConfig } = require("../../start/mongologin");

module.exports = {
    name: "prefix",
    category: "moderation",
    run: async(client, message, args) => {
  let prefix = args[0];
  const configdb = await collectionConfig.find({}).toArray();
  const prefixo = configdb[0].extraprefix;
  message.channel.send(`Os prefixos são \`+\` e \`${prefixo}\``)
}};