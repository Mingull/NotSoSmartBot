module.exports = {
    name: 'clear',
    aliases: ["clean", "purge", "nuke"],
    category: "moderation",
    description: "Clears the chat",
    usages: '[amount]',
    private: true,
    run: async (client, message, args) => {
        if (message.deletable) {
            message.delete();
        }

        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("You can't delete messages.....").then(msg => msg.delete({ timeout: 3000 }));
        }

        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.reply("Yeah.... thats not a number? I also can't delete 0 messages BTW!").then(msg => msg.delete({ timeout: 3000 }));
        }

        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("I can't delete messages.....").then(msg => msg.delete({ timeout: 3000 }));
        }

        let deleteAmount;

        if (parseInt(args[0]) > 100) {
            deleteAmount = 100;
        } else {
            deleteAmount = parseInt(args[0]);
        }

        message.channel.bulkDelete(deleteAmount, true)
            .then(deleted => message.channel.send(`Clearing \`${deleted.size} messages\``))
            .catch(err => message.reply(`Something went wrong... ${err}`))
            .then(msg => msg.delete({ timeout: 3000 }));
    }
}