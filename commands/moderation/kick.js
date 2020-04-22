const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../backend/functions.js");
module.exports = {
    name: "kick",
    aliases: [""],
    category: "moderation",
    description: "kicks the member",
    usage: "<Mention | ID>",
    private: true,
    run: async (client, message, args) => {
        const reportsChannel = message.guild.channels.cache.find(c => c.name === "reports" && c.type == "text");
        if (reportsChannel) {
            return message.channel.send("I could not find a \`#reports\` channel").then(msg => msg.delete({ timeout: 3000 }))
        }
        if (message.deletable) message.delete();
        if (!args[0]) {
            return message.reply("Please provide a person to kick")
                .then(msg => msg.delete({ timeout: 3000 }));
        }
        if (!args[1]) {
            return message.reply("Please provide a reason to kick")
                .then(msg => msg.delete({ timeout: 3000 }));
        }
        if (!message.member.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ You do not have permission to kick members.\n**`Please contact a staff member`**")
                .then(msg => msg.delete({ timeout: 3000 }));
        }
        if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ I do not have permission to kick members.\n**`Please contact a staff member`**")
                .then(msg => msg.delete({ timeout: 3000 }));
        }
        const toKick = message.mentions.members.first() || message.guild.members.cach.get(args[0])
        if (!toKick) {
            return message.reply("❌ Can't find that person, try again!")
                .then(msg => msg.delete({ timeout: 3000 }));
        }
        if (message.author.id === toKick.id) {
            return message.reply("❌ Can't kick yourself...\n`smart boi 🤓`")
                .then(msg => msg.delete({ timeout: 3000 }));
        }
        if (!toKick.kickable) {
            return message.reply("I can't kick that person due to role hierachy, I suppose...")
                .then(msg => msg.delete({ timeout: 3000 }));
        }
        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(toKick.user.displayAvatarURL())
            .setFooter(message.member.displayName, message.author.displayAvatarURL())
            .setTimestamp()
            .setDescription(stripIndents`**>> Kicked member:** ${toKick} (${toKick.id})
            **>> Kicked by:** ${message.author} (${message.author.id})
            **>> Reason:** ${args.slice(1).join(" ")}`);
        const promptEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor("This verification becomes invalid after 30s")
            .setDescription(`Do you want to kick ${toKick}?`);
        await message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
            if (emoji === "✅") {
                msg.delete();
                toKick.kick(args.slice(1).join(" ")).catch(err => {
                    if (err) return message.channel.send(`Well..... something went wrong?`)
                });
                reportsChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();
                message.reply("Kick canceled..")
                    .then(msg => msg.delete({ timeout: 3000 }));
            }
        });
    }
}