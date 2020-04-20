const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core")

module.exports = {
    name: "play",
    aliases: [""],
    category: "music",
    description: "plays the music",
    usage: "<url>",
    private: false,
    run: async (client, message, args, options) => {
        if (message.deletable) message.delete();

        if (!message.member.voice.channel) { return message.channel.send("You must be in a voice channel to play music!"); }

        if (!args[0]) { return message.channel.send("You need to provide a link"); }

        var validate = await ytdl.validateURL(args[0])

        if (!validate) { return message.channel.send("Give a valid URL"); }

        var info = await ytdl.getInfo(args[0]);

        var data = options.active.get(message.guild.id) || {};

        if (!data.connection) data.connection = await message.member.voice.channel.join();

        if (!data.queue) data.queue = [];

        data.guildID = message.guild.id;

        data.queue.push({
            songTitle: info.title,
            requester: message.author.tag,
            url: args[0],
            announceChannel: message.channel.id,
            thumbnail: info.thumbnail_url,
            duration: info.length_seconds
        });
        if (!data.dispatcher) {
            Play(client, options, data);
        } else {
            const queueEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setThumbnail(info.thumbnail)
                .setDescription(`Added to queue \`\`\`${info.title}\`\`\`Duration: \`\`\`${timeCalc(info.length_seconds)}\`\`\`Requested by: \`\`\`${message.author.tag}\`\`\``)
            message.channel.send(queueEmbed);
        }

        options.active.set(message.guild.id, data)
    }
}
async function Play(client, options, data) {
    const nowPlayingEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setThumbnail(data.queue[0].thumbnail)
        .setDescription(`Now playing: \`\`\`${data.queue[0].songTitle}\`\`\`Duration: \`\`\`${timeCalc(data.queue[0].duration)}\`\`\`Requested by: \`\`\`${data.queue[0].requester}\`\`\``)
    client.channels.cache.get(data.queue[0].announceChannel).send(nowPlayingEmbed);
    var options = { seek: 2, volume: 1, bitrate: 96000 };

    data.dispatcher = await data.connection.play(ytdl(data.queue[0].url, { filter: "audioonly" }), options);
    data.dispatcher.guildID = data.guildID;

    data.dispatcher.once("end", function () {
        Finish(client, options, this);
    })
}
function Finish(client, options, dispatcher) {
    var fetchedData = options.active.get(dispatcher.guildID).catch(err => console.log(err));

    fetchedData.queue.shift();

    if (fetchedData.queue.length > 0) {
        options.active.set(dispatcher.guildID, fetchedData);

        Play(client, options, fetchedData);
    } else {
        options.active.delete(dispatcher.guildID);

        var voiceChannel = client.guilds.get(dispatcher.guildID).me.voice.channel;

        if (voiceChannel) voiceChannel.leave();
    }
}
function timeCalc(totalSeconds) {
    const secondsInHour = 60 * 60;
    const secondsInMinute = 60;
    var entireHour = totalSeconds / secondsInHour;
    var secondsLeftOver = totalSeconds % secondsInHour;

    /* hele minuut */
    var entireMinute = secondsLeftOver / secondsInMinute;
    secondsLeftOver = secondsLeftOver % secondsInMinute;
    entireHour = Math.round(entireHour);
    entireMinute = Math.round(entireMinute)
    if (entireHour < 10) {
        entireHour = `0${entireHour}`
    }
    if (entireMinute < 10) {
        entireMinute = `0${entireMinute}`
    }
    if (secondsLeftOver < 10) {
        secondsLeftOver = `0${secondsLeftOver}`
    }
    if (entireHour >= 1) {
        return `${entireHour}:${entireMinute}:${secondsLeftOver}`
    } else {
        return `${entireMinute}:${secondsLeftOver}`;
    }
}