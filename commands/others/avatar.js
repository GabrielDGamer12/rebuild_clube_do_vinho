const Discord = require("discord.js");
const { Message, Client, MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
    name: "avatar",
    category: "others",
    run: async(client, message, args) => {

  let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
  
  let avatar = user.avatarURL({ dynamic: true, format: "png", size: 1024 });

  let embed = new MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setTitle(`Avatar de ${user.username}`) 
    .setImage(avatar) 
    .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}));
 return message.channel.send({ embeds: [embed] });

}};