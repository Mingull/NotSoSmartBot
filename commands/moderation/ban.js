const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../backend/functions.js");
module.exports = {
    name: "ban",
    aliases: ["banhammer"],
    category: "moderation",
    description: "bans the member",
    usage: "<Mention | ID>",
    private: true,
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.cache.find(c => c.name === "logs") || message.channel;
        if (message.deletable) message.delete();
        if (!args[0]) {
            return message.reply("Please provide a person to ban")
                .then(msg => msg.delete({ timeout: 3000 }));
        }
        if (!args[1]) {
            return message.reply("Please provide a reason to ban")
                .then(msg => msg.delete({ timeout: 3000 }));
        }
        if (!message.member.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ You do not have permission to ban members.\n**`Please contact a staff member`**")
                .then(msg => msg.delete({ timeout: 3000 }));
        }
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ I do not have permission to ban members.\n**`Please contact a staff member`**")
                .then(msg => msg.delete({ timeout: 3000 }));
        }
        const toBan = message.mentions.members.first() || message.guild.members.cach.get(args[0])
        if (!toBan) {
            return message.reply("❌ Can't find that person, try again!")
                .then(msg => msg.delete({ timeout: 3000 }));
        }
        if (message.author.id === toBan.id) {
            return message.reply("❌ Can't ban yourself...\n`smart boi 🤓`")
                .then(msg => msg.delete({ timeout: 3000 }));
        }
        if (!toBan.bannable) {
            return message.reply("I can't ban that person due to role hierachy, I suppose...")
                .then(msg => msg.delete({ timeout: 3000 }));
        }
        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.displayAvatarURL())
            .setFooter(message.member.displayName, message.author.displayAvatarURL())
            .setTimestamp()
            .setDescription(stripIndents`**>> banned member:** ${toBan} (${toBan.id})
            **>> banned by:** ${message.author} (${message.author.id})
            **>> Reason:** ${args.slice(1).join(" ")}`);
        const promptEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor("This verification becomes invalid after 30s")
            .setDescription(`Do you want to ban ${toBan}?`);
        await message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
            if (emoji === "✅") {
                msg.delete();
                toBan.ban(args.slice(1).join(" ")).catch(err => {
                    if (err) return message.channel.send(`Well..... something went wrong?`)
                });
                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();
                message.reply("ban canceled..")
                    .then(msg => msg.delete({ timeout: 3000 }));
            }
        });
    }
}