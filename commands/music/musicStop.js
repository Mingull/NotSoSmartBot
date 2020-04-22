const ytdl = require("ytdl-core");
module.exports = {
    name: "stop",
    aliases: ["disconnect", "disc", "leave"],
    category: "music",
    description: "stops the music",
    usage: "",
    private: false,
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        if (!message.member.voice.channel) {
            return message.channel.send("You must be in a voice channel to play music!");
        }

        if (!message.guild.me.voice.channel) {
            return message.channel.send("Bot is not connected to a voice channel");
        }

        if(message.guild.me.voice.channel.id != message.member.voice.channel.id){
            return message.channel.send("You need to be in same voice channel");
        }

        message.guild.me.voice.channel.leave().then(() => {
            const procfile = require("Procfile");
            procfile.worker;
        });
        message.channel.send("```Disconnected...```");
    }
}