const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");

module.exports = {
    name: "queue",
    aliases: [""],
    category: "music",
    description: "shows the current queue",
    usage: "",
    private: false,
    run: async (client, message, args, options) => {
        if (message.deletable) message.delete();

        var guildIDData = options.active.get(message.guild.id);

        if (!guildIDData) {
            return message.channel.send("There are currently no songs playing!");
        }

        var queue = guildIDData.queue;
        var nowPlaying = queue[0];

        var responce = `Now playing: \`\`\`${nowPlaying.songTitle}\`\`\` Requested by: \`\`\`${nowPlaying.requester}\`\`\`\n**Queue:**\n`;

        for (let i = 0; i < queue.length; i++) {
            if (i == 0) {
                responce += `\`\`\`> ${i} - ${queue[i].songTitle}\nRequested by: ${queue[i].requester}\n\`\`\``
            } else {
                responce += `\`\`\`${i} - ${queue[i].songTitle}\nRequested by: ${queue[i].requester}\n\`\`\``
            }
        }
        const responceEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setThumbnail(nowPlaying.thumbnail)
            .setDescription(responce)

        message.channel.send(responceEmbed).then(msg => msg.delete({ timeout: 10000 }));
    }
}