module.exports.run = async (client, message, args) => {
  const m = await message.channel.send('');
};
const Discord = require("discord.js");
const { Message, Client, MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
    name: "dev",
    category: "others",
    run: async (client, message, args) => {

  const embed = new MessageEmbed()
    .setTitle("Desenvolvedor")
    .setThumbnail("https://cdn.discordapp.com/attachments/787491838545231902/833738674716803123/Arte_de_Canal.jpg")
    .setColor("#FF0000")
    .setDescription(`**Desenvolvido Por GabrielDGamer.** \n\n**Instagram**: https://www.instagram.com/gabrieldgamer_/\n**Youtube**: https://youtube.com/c/gabrieldgamer\n**Twitch**: https://www.twitch.tv/gabrieldgamer_\n\n Caso encontre algum erro no bot <@798993451793514496>, envie uma mensagem para <@737039257709051925>\n\nCódigo Aberto: **https://repl.it/@GabrielDGamer/Clube-do-Vinho-2**`)

  message.channel.send({embeds:[embed]});
}};