const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'ticket',
    aliases: ["support"],
    category: "moderation",
    description: "Start a support session",
    usage: "",
    private: false,
    run: async (client, message, args) => {
        if(message.deletable) message.delete();
        const ticketCategory = client.channels.cache.find(c => c.name == "tickets" && c.type == "category")

        const userName = message.author.username;
        const userId = message.author.id;
        const userDiscri = message.author.discriminator;

        var bool = false;

        message.guild.channels.cache.forEach((channel) => {
            if (channel.name == `ticket-${userName.toLowerCase()}_${userDiscri}`) {
                message.channel.send(`Your support channel: \`ticket-${userName.toLowerCase()}_${userDiscri}\``);
                channel.send(`Here it is <@${userId}>`)
                bool = true;
            }
        });

        if (bool === true) return;

        const TickCreatedEmbed = new MessageEmbed()
            .setTitle(`Hey, ${userName}`)
            .setDescription(`your support channel has been created: \`ticket-${userName.toLowerCase()}_${userDiscri}\``)
            .setTimestamp();
        message.channel.send(TickCreatedEmbed);

        message.guild.channels.create(`ticket-${userName.toLowerCase()}_${userDiscri}`, "text").then((createdChan) => {
            createdChan.setParent(ticketCategory.id).then((parentSet) => {
                parentSet.overwritePermissions([
                    {
                        id: message.guild.roles.cache.find(r => r.name == "@everyone").id,
                        deny: ['READ_MESSAGES'],
                    },
                ]);
                parentSet.overwritePermissions([{
                    id: message.author.id,
                    allow: ['READ_MESSAGES', 'SEND_MESSAGES', 'ATTACH_FILES', 'CONNECT', 'ADD_REACTION'],
                    deny: ['CREATE_INSTANT_INVITE'],
                }]);
    
                const TickInfoEmbed = new MessageEmbed()
                    .setTitle(`Hey, ${userName}`)
                    .setDescription(`put your message here or ask your questions here so that the staff can answer them`)
                    .setTimestamp();
                parentSet.send(TickInfoEmbed);
            }).catch(err => {
                message.channel.send("Something went wrong");
            });
        }).catch(err => {
            message.channel.send("Something went wrong");
        });
    }
}