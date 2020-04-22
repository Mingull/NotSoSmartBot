const ytdl = require("ytdl-core");
module.exports = {
    name: "join",
    aliases: [""],
    category: "music",
    description: "bot joins voice channel your in",
    usage: "",
    private: false,
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        if (!message.member.voice.channel) {
            return message.channel.send("You must be in a voice channel to play music!");
        }

        if (message.guild.me.voice.channel) {
            return message.channel.send("Bot is already connected to a voice channel");
        }

        message.member.voice.channel.join();
        message.channel.send("```Joining...```");
    }
}