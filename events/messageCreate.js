const client = require("..");
var config = require("../settings/config.json");
var ee = require("../settings/embed.json");
const { MessageEmbed } = require("discord.js");
const db = require('quick.db');
const prefixodb = db.get('prefixodb')

client.on('messageCreate', async message => {
    const prefixes = ['+', `${prefixodb}`];
    if (!message.guild) return;
    if (message.author.bot) return;
    if (message.channel.partial) await message.channel.fetch();
    if (message.partial) await message.fetch();
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    //if(!message.content.startsWith(prefix)) return;

    // getting prefix when bot mention
    
        if (message.mentions.has(client.user)) {
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(ee.embed_color)
                    .setAuthor(`Hey, Você me mencionou.. 😉`)
                    .setDescription(`Fui desenvolvido por <@737039257709051925> \n\n Meu nome é **${client.user.username}** \n Meus prefixos são \`${prefixodb}\` e \`+\` \n Você pode ver todos os meus comandos digitando \`+ajuda\``)
                    .setFooter(ee.embed_footertext, ee.embed_footericon)
                ]
            });

        }
    let hasPrefix = false;
    prefixes.some(p => message.content.startsWith(p)) ? hasPrefix = true : null;
    if(!hasPrefix) return;

    const command = client.commands.get(cmd.toLowerCase()) ||  client.commands.find((cmds) => cmds.aliases && cmds.aliases.includes(cmd));
    if (!command) {message.channel.send("Esse comando não existe! Para saber quais são os comandos utilize \`+ajuda\`")};
    if (command)
        command.run(client, message, args, prefix);
})