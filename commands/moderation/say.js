const { Client, MessageEmbed } = require('discord.js');
module.exports = {
    name: 'say',
    aliases: ["say", "broadcast"],
    category: 'Moderation',
    description: "Sends a message",
    usage: "<input>",
    private: false,
    run: async (client, message, args) => {
        if (message.deletable) message.delete();
        if (args.length < 1) return message.reply("Nothing to say?").then(msg => msg.delete(3000));

        const roleColor = message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;
        if (args[0].toLowerCase() === "embed") {
            const sayEmbed = new MessageEmbed()
                //.setTitle(message.author.username)
                .setColor(roleColor)
                .setDescription(args.slice(1).join(" "))
                .setTimestamp()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setFooter(client.user.username, client.user.displayAvatarURL())
            message.channel.send(sayEmbed);
        } else {
            message.channel.send(args.join(" "));
        }
    }
}