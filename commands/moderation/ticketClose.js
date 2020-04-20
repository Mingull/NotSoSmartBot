const { MessageEmbed } = require("discord.js");
const config = require("../../backend/config.json");

module.exports = {
    name: 'close',
    aliases: ["support-end", "end"],
    category: "moderation",
    description: "Ends a support session",
    usage: "",
    private: true,
    run: async (client, message, args) => {
        if (message.deletable) message.delete();
        const ticketCategoryID = client.channels.cache.find(c => c.name == "tickets" && c.type == "category")

        if (message.channel.parentID == ticketCategoryID.id) {
            message.channel.delete();
        }
        else {
            message.channel.send("Please use this command in a ticket channel");
        }
        const TickCreatedEmbed = new MessageEmbed()
            .setTitle(`Hey, ${message.channel.name}`)
            .setDescription(`Your ticket has beed marked as **DONE**. if you want to make a new ticket do ${config.prefix}ticket`)
            .setFooter(`ticket closed!`)
            .setTimestamp();
        const logChannel = message.guild.channels.cache.find(c => c.name == "logs" && c.type == "text");
        if(!logChannel) return message.channel.send("Cannot find logs channel");
        logChannel.send(TickCreatedEmbed);
    }
}