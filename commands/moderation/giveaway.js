module.exports = {
    name: 'giveaway',
    aliases: ["freestuff"],
    category: "moderation",
    description: "Start a giveaway",
    usage: "",
    private: true,
    run: async (client, message, args) => {
        return message.channel.send("hello")
    }
}