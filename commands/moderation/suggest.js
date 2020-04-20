const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "suggest",
    aliases: [""],
    category: "moderation",
    description: "Give a suggestion!",
    usage: "<suggestion>",
    run: async (client, message, args) => {
        if(message.deletable) message.delete();
        var suggestion = args.join(" ");
        if (!suggestion) return message.channel.send("You are suggestion nothing....\nYou need to provide a suggestion!")

        const suggestionEmbed = new MessageEmbed()
            .setColor("#69ff91")
            .setThumbnail(message.author.displayAvatarURL())
            .setTitle("Suggestion")
            .addField("**Suggestion:**", suggestion)
            .addField("Sugegsted by:", message.author)
            .setFooter("If you like this suggestion react with \"👍\" and if you don't \"👎\"")

        const suggestionChannel = message.guild.channels.cache.find(c => c.name == "suggestions" && c.type == "text");
        if (!suggestionChannel) return message.channels.send("Couldn't find suggestions channel")

        suggestionChannel.send(suggestionEmbed).then(suggest => {
            suggest.react('👍')
            suggest.react('👎')
        })
    }
}