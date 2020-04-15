const { MessageEmbed } = require("discord.js");
const { getMember } = require("../../backend/functions.js");

module.exports = {
    name: "love",
    aliases: ["affinity"],
    category: "fun",
    description: "Calculate the love affinity you have for another person.",
    usage: "[mention | id | username]",
    private: false,
    run: async (client, message, args) => {
        let person = getMember(message, args[0]);

        if (!person || message.author.id === person.id) {
            person = message.guild.members.cache
                .filter(m => m.id !== message.author.id)
                .random();
        }

        const love = Math.random() * 100;
        const loveIndex = Math.floor(love / 10);
        const loveLevel = "💖".repeat(loveIndex) + "💔".repeat(10 - loveIndex);

        const embed = new MessageEmbed()
            .setColor("#ffb6c1")
            .addField(`❤ **${person.displayName}** loves **${message.member.displayName}** this much`,
                `💟 ${Math.floor(love)}%\n\n${loveLevel}`)
            .setThumbnail(person.user.displayAvatarURL());

        message.channel.send(embed);
    }
}