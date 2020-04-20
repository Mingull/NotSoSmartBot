const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");

module.exports = {
    name: "pause",
    aliases: [""],
    category: "music",
    description: "pause the music",
    usage: "",
    private: false,
    run: async (client, message, args, options) => {
        if (message.deletable) message.delete();

        var guildIDData = options.active.get(message.guild.id);

        if (!guildIDData) { return message.channel.send("There are currently no songs playing!"); }

        if (message.guild.me.voice.channelID != message.member.voice.channelID) { return message.channel.send("You need to be in same voice channel"); }

        if (guildIDData.dispatcher.paused) { return message.channel.send("Music already paused") }

        guildIDData.dispatcher.pause();

        const pauseEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`Succesfully paused songs \`\`\`${guildIDData.queue[0].songTitle}\`\`\``)
        return message.channel.send(pauseEmbed);
    }
}