const { Client, MessageEmbed } = require("discord.js");
const config = require("../../backend/config.json");
const { stripIndents } = require("common-tags");

module.exports = {
    name: 'info',
    aliases: ["info"],
    category: 'Information',
    description: "Returns latency",
    usage: "<bot | [server | guild]>",
    private: false,
    run: async (client, message, args) => {
        if (message.deletable) {
            message.delete();
        }

        const infoEmbed = new MessageEmbed()
            .setColor("RANDOM")

        if (args[0] === "bot") {
            const name = message.guild.me.displayName;
            const author = config.botInfo.author;
            const createdAt = config.botInfo.createdAt;
            const version = config.botInfo.version;
            const description = config.botInfo.description;
            infoEmbed.addField(`Bot information`, stripIndents`**>> Name:** ${name}
            **>> Author:** ${author}
            **>> Version:** ${version}
            **>> Created on:** ${createdAt}
            **>> Description:** ${description}
            **>> Running on: ** \`${client.guilds.cache.size} servers\``)
                .setThumbnail(client.user.displayAvatarURL())
        }
        if (args[0] === "guild" || args[0] === "server") {
            const guildName = message.guild.name;
            const owner = message.guild.owner;
            const members = message.guild.members.cache.map(user => user.user)
            let totalBots = 0;
            members.forEach(user => {
                if (user.bot) {
                    totalBots = totalBots + 1;
                }
            })
            const createdAt = message.guild.createdAt;
            infoEmbed.addField(`Guild information`, stripIndents`**>> Name:** ${guildName}
            **>> Owner:** ${owner} (${owner.id})
            **>> Members:** ${message.guild.memberCount}
            **>> Bots:** ${totalBots}
            **>> Created on:** ${createdAt}`)
                .setThumbnail(client.user.displayAvatarURL())
        }

        await message.channel.send(infoEmbed);
    }
}