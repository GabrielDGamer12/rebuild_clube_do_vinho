module.exports = {
    name: "restart",
    category: "owner",
    run: async (client, message, args) => {
        if (message.author.id !== '311531938286534656') {
            return message.channel.send(`🚨 | Desculpe, mas você não tem permissão para isso.`)
        }
        await message.channel.send(`Reiniciando Bot...`)
        process.exit();
    }
}