const Discord = require("discord.js");

module.exports = {
    name: "clear",
    category: "moderation",
    run: async(client, message, args) => {
  if (!message.member.permissions.has("MANAGE_MESSAGES"))
    return message.reply(
      "Você não tem permissão para fazer isso!"
    );
  var canal = message.guild.channels.cache.find(ch => ch.id === "747251842769092729");
  const deleteCount = parseInt(args[0], 10);
  if (!deleteCount || deleteCount < 2 || deleteCount > 100)
    return message.reply(
      "forneça um número entre **2 e 100 mensagens** a serem excluídas"
    ).then(m => setTimeout(() => m.delete(), 5000)).then(setTimeout(() => message.delete(), 500));
    
  const fetched = await message.channel.messages.fetch({
    limit: deleteCount
  }, true);
  const msgsDeleted = await message.channel.bulkDelete(fetched, true);
  console.log(msgsDeleted.size);
  if (args[0] - msgsDeleted.size == 0){
    console.log("0 mensagens deletadas")
    message.channel.send(msgsDeleted.size + ' mensagens limpas nesse chat!').then(msg => setTimeout(() => msg.delete(), 5000))
    .catch(error =>
      console.log(` mensagens não foi possível deletar mensagens devido a: ${error}`)
    );
  } else {
    message.channel.send(msgsDeleted.size + ' mensagens limpas nesse chat! (' + (args[0] - msgsDeleted.size ) + " mensagens não foram apagadas por serem muito antigas.)" ).then(msg => setTimeout(() => msg.delete(), 5000))
    .catch(error =>
      console.log(` mensagens não foi possível deletar mensagens devido a: ${error}`)
    );
  }
}};