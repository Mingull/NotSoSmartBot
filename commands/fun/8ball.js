const { MessageEmbed } = require("discord.js");
module.exports = {
    name: '8ball',
    aliases: ["8b"],
    category: 'fun',
    description: "Sends a random message",
    usage: "",
    private: false,
    run: async (client, message, args) => {
        if (message.deletable) { message.delete(); }
        if (!args[2]) { return message.reply("Please ask a full question"); }
        let replies = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes - definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.",
            "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.",
            "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];

        let result = Math.floor((Math.random() * replies.length));
        let question = args.slice(1).join(" ");

        let ballembed = new MessageEmbed()
            .setAuthor(message.author.tag)
            .setColor("#7289DA")
            .addField("Question", question)
            .addField("Answer", replies[result]);

        message.channel.send(ballembed);
    }
}