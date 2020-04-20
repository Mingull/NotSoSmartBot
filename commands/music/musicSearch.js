const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const search = require("yt-search");

module.exports = {
    name: "search",
    aliases: [""],
    category: "music",
    description: "search a song to play",
    usage: "",
    private: false,
    run: async (client, message, args, options) => {
        if (message.deletable) message.delete();

        search(args.join(" "), function (err, res) {
            if (err) return message.channel.send(`Error: ${err}`)

            var videos = res.videos.slice(0, 10);

            var response = '';

            for (const i in videos) {
                response += `**${parseInt(i) + 1}:** ${videos[i].title} \r\n`
            }
            response += `Choose a number between 1-${videos.length}`;


            message.channel.send(response);

            const filter = music => !isNaN(music.content) && music.content < videos.length && music.content > 0;

            const collection = message.channel.createMessageCollector(filter);

            collection.videos = videos;

            collection.once("collect", function (music) {
                var commandFile = require("./musicPlay.js");

                commandFile.run(client, message, [this.videos[parseInt(music.content) - 1].url], options);
            })
        });
    }
}