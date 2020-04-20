const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");

module.exports = {
    name: "volume",
    aliases: [""],
    category: "music",
    description: "sets a volume of the current song",
    usage: "",
    private: false,
    run: async (client, message, args, options) => {
        if (message.deletable) message.delete();

        var guildIDData = options.active.get(message.guild.id);

        if (!guildIDData) { return message.channel.send("There are currently no songs playing!"); }

        if (message.guild.me.voice.channelID != message.member.voice.channelID) { return message.channel.send("You need to be in same voice channel"); }

        if (isNaN(args[0]) || args[0] < 0 || args[0] > 150) { return message.channel.send("Please give a number between 0 - 150") }

        guildIDData.dispatcher.setVolume(args[0] / 100)

        return message.channel.send(`The volume is changed to ${args[0]} for song ${guildIDData.queue[0].songTitle}`);
    }
}