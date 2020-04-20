const { Client, MessageEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
module.exports = {
    name: 'help',
    aliases: ["help", "commands"],
    category: 'information',
    description: "Gives a help message",
    usage: "[Command | alias]",
    private: false,
    run: async (client, message, args) => {
        if (message.deletable) message.delete();
        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            return getALL(client, message);
        }
    }
}

function getALL(client, message) {
    const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`${message.guild.me.displayName} | Command list`)
        .setThumbnail(message.guild.iconURL())

    const commands = (category) => {
        if (message.member.roles.cache.find(r => r.name == "OWNER" || r.name == "Moderator")) {
            return client.commands
                .filter(cmd => cmd.category === category)
                .map(cmd => `${cmd.name}`)
                .join("\n")
        } else {
            return client.commands
                .filter(cmd => cmd.category === category)
                .filter(cmd => cmd.private == false)
                .map(cmd => `${cmd.name}`)
                .join("\n")
        }
    }
    // const catName1 = client.categories.map(cat => `${cat[0].toUpperCase() + cat.slice(1)}`);
    // const catCMD = client.categories.map(cat => `\`\`\`${commands(cat)}\`\`\``).reduce((string, category) => string + "\n" + category);
    // embed.addField(catName1, catCMD, true);

    // return message.channel.send(embed);
    const info = client.categories
        .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n\`\`\`\n${commands(cat)}\`\`\``)
        .reduce((string, category) => string + "\n" + category);

    return message.channel.send(embed.setDescription(info, true));
}

function getCMD(client, message, input) {
    const embed = new MessageEmbed()
        .setThumbnail(message.guild.iconURL())

    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

    let info = `no information found for command **${input.toLowerCase()}**`;

    if (!cmd) {
        return message.channel.send(embed.setColor("RED").setDescription(info))
    }

    if (cmd.name) info = `**Command name:** ${cmd.name}`;
    if (cmd.aliases) info += `\n**Aliases:** ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\n**Description:** ${cmd.description}`;
    if (cmd.private == true) info += `\n**Moderators only:** true`;
    if (cmd.private == false) info += `\n**Moderators only:** false`;
    if (cmd.usage) {
        info += `\n**Usage:** ${cmd.usage}`;
        embed.setFooter("Syntax: <> = required, [] = optional");
    }
    return message.channel.send(embed.setColor("GREEN").setDescription(info));
}