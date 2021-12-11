const Discord = require("discord.js");
const { Message, Client, MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
    name: "ajuda",
    aliases: ['help'],
    category: "others",
    run: async(client, message, args, cmd, Discord) => {

  const embed = new MessageEmbed()
    .setTitle(`Ajuda`)
    .setColor("#FF0000")
    .addField("\`+ajuda\`","Mostra essa mensagem!")
    .addField("\`+avatar\` ou \`/avatar\`","Envia seu avatar no chat(ou de quem for menciona)!")
    .addField("\`+ban\` ou \`+banir\`","Bane alguem\n\`Comando Exclusivo Moderadores\`")
    .addField("\`+clear\`", "Limpa o chat\n\`Comando Exclusivo Moderadores\`")
    .addField("\`+coinflip\`", "Cara ou Coroa")
    .addField("\`+dev\` | \`+codigo\` | \`+desenvolvedor\`", "Mostra informações do desenvolvedor e o código fonte do Bot")
    .addField("\`+kick\` ou \`+expulsar\`", "Expulsa alguem\n\`Comando Exclusivo Moderadores\`")
    .addField("\`+ping\` ou \`/ping\`", "Mostra o Ping do Bot")
    .addField("\`+prefix\` ou \`+prefixo\`", "Mostra os prefixos atuais")
    .addField("\`+setprefix\` ou \`+set-prefix\`", "Define um prefixo extra\n\`Comando Exclusivo Moderadores\`")
    .addField("\`+sugestao\` ou \`+ideia\`", "Envie uma sugestão!")
    .addField("\`+unban\` ou \`+desbanir\`", "Desbane alguem a partir do ID\n\`Comando Exclusivo Moderadores\`")
    .addField("\`+uptime\` ou \`/uptime\`", "Mostra quanto tempo o bot não é reiniciado!")
    //.setDescription(`**───────────── Clube do Vinho🍷 ─────────────**\n\n                                 **Comandos **\n\n+uptime		**|** \n+avatar	 	**|** \n+ideia   	 	**|** \n\n**───────────── Clube do Vinho🍷 ─────────────**`)
/*
ajuda
avatar
ban
clear
coinflip
dev
kick
ping
prefix
setprefix
unban
uptime
*/

  return message.channel.send({ embeds: [embed] });
}};