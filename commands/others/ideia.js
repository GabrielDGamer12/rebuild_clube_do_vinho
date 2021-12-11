const Discord = require("discord.js");
const { Message, Client, MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
    name: 'ideia',
    aliases: ['sugestão', 'sugestao'],
    run: async (client, message, args) => {
message.delete();
const content = args.join(" ");

if (!args[0]) {
  return message.channel.send(`${message.author}, escreva a sugestão após o comando`)
} else if (content.length > 1000) {
  return message.channel.send(`${message.author}, forneça uma sugestão de no máximo 1000 caracteres.`);
} else {
  let user = (message.author);
  let userid = (message.author.id);
  var canal = message.guild.channels.cache.find(ch => ch.id === "890122504423735318");
  const embed = new MessageEmbed()
    .setColor("RED")
    .addField("Autor:", " <@" + message.author + ">")
    .addField("Conteúdo", " " + content)
    .setFooter("ID do Autor: " + userid)
    .setTimestamp()
  const msg = await canal.send({ embeds: [embed] }).then(msg => {
    const emojis = ["✅", "❌"];
    for (const i in emojis) {
        msg.react(emojis[i])
    }
  })
  //return canal.send({ embeds: [embed] });
  return message.channel.send(`${message.author} a mensagem foi enviada com sucesso!`);
}}
};