const ytdl = require("ytdl-core");

module.exports = {
    name: "skip",
    aliases: ["next"],
    category: "music",
    description: "stops the music",
    usage: "",
    private: false,
    run: async (client, message, args, options) => {
        if (message.deletable) message.delete();

        var guildIDData = options.active.get(message.guild.id);

        if (!guildIDData) {
            return message.channel.send("There are currently no songs playing!");
        }

        if(message.guild.me.voice.channelID != message.member.voice.channelID   ){
            return message.channel.send("You need to be in same voice channel");
        }

        var amountUsers = message.member.voice.channel.members.size;

        var amountSkip = Math.ceil(amountUsers / 2);

        if(!guildIDData.queue[0].voteSkips) guildIDData.queue[0].voteSkips = [];

        if(guildIDData.queue[0].voteSkips.includes(message.member.id)) return message.channel.send(`You have already voted to skip ${guildIDData.queue[0].voteSkips.length}/${amountSkip}`);

        guildIDData.queue[0].voteSkips.push(message.member.id);

        options.active.set(message.guild.id, guildIDData);
        //console.log(options.active.set(message.guild.id, guildIDData))

        if(guildIDData.queue[0].voteSkips.length >= amountSkip){
            message.channel.send("Skipping this song!");
            
            return guildIDData.dispatcher.emit("end");  
        }

        message.channel.send(`voted to skip this songs. ${guildIDData.queue[0].voteSkips.length}/${amountSkip}`)
    }
}