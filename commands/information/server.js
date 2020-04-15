const { Client, MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const server = require("minecraft-server-util");

module.exports = {
    name: 'server',
    aliases: ["mcs", "mc-server"],
    category: 'information',
    description: "Gives information about a minecraft server\n`like play.hypixel.net`",
    usage: "<server-IP> [port]",
    private: false,
    run: async (client, message, args) => {
        if (message.deletable) {
            message.delete();
        }

        const letters = ["§4", "§c", "§6", "§e", "§2", "§a", "§b", "§3", "§1", "§9", "§d", "§5", "§f", "§7", "§8", "§0", "§l", "§m", "§n", "§o", "§r"]
        const serverIP = args[0];
        let serverPort = parseInt(args[1]);

        if (!serverIP || !args[0]) {
            return message.reply("You need to provide a mc server IP")
                .then(msg => msg.delete({ timeout: 3000 }));
        }

        if (!serverPort || !args[1]) {
            serverPort = 25565;
            message.reply("no port given. Port set to 25565")
                .then(msg => msg.delete({ timeout: 3000 }));
        }

        server(serverIP, serverPort, (error, response) => {
            if (error) throw error;
            const serverEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`Server: \`${response.host}:${response.port}\``)
                .setDescription(stripIndents`**>> Description:** ${response.descriptionText}
                **>> Max players:** ${response.maxPlayers}
                **>> Online Players:** ${response.onlinePlayers}
                **>> Version:** ${response.version}`, true)
                .setThumbnail(client.user.displayAvatarURL())
            message.channel.send(serverEmbed)
            console.log(response);
        });
    }
}