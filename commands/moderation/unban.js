const { MessageEmbed } = require('discord.js');
const Discord = require("discord.js");

module.exports = {
    name: 'unban',
    aliases: ["desbanir"],
    run: async (client, message, args) => {

        if (!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send('🚨 | Desculpe, mas você não tem permissão para isso.').then(m => setTimeout(() => m.delete(), 5000)).then(setTimeout(() => message.delete(), 500));

        if (!args[0]) return message.channel.send('Por favor coloque o ID do usuário a ser desbanido!').then(m => setTimeout(() => m.delete(), 5000)).then(setTimeout(() => message.delete(), 500));

        let member;

        try {
            member = await client.users.fetch(args[0])
        } catch (e) {
            console.log(e)
            return message.channel.send('Usuário Inválido!').then(m => setTimeout(() => m.delete(), 5000)).then(setTimeout(() => message.delete(), 500));
        }

        const reason = args[1] ? args.slice(1).join(' ') : 'Nenhum motivo expecificado';

        const embed = new MessageEmbed()
            .setFooter(`${message.author.tag} | ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }));

        message.guild.bans.fetch().then( bans => {
            var canal = message.guild.channels.cache.find(ch => ch.id === "729889550809432124");
            const user = bans.find(ban => ban.user.id === member.id );

            if (user) {
                embed.setTitle(`Usúario Desbanido`)
                    .setColor('#00ff00')   
                    .setTimestamp()               
                    .addField('Usuário:', user.user.tag)
                    .addField('ID:', user.user.id)
                    .addField('Motivo', reason)
                message.guild.members.unban(user.user.id, reason).then(db.delete(`userInfo.bans_${user.username}`)).then(() => message.channel.send({ embeds: [embed] }))
            } else {
                embed.setTitle(`O Usuário ${member.tag} não está banido!`)
                    .setColor('#ff0000')
                message.channel.send({ embeds: [embed] })
            }

        }).catch(e => {
            console.log(e)
            message.channel.send('Ocorreu um erro!')
        });

    }
}