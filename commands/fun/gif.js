const { gyphyTOKEN } = require("../../backend/config.json");
const GphApiClient = require("giphy-js-sdk-core");
giphy = GphApiClient(gyphyTOKEN);

module.exports = {
    name: "gif",
    aliases: [''],
    category: "fun",
    description: "Sends a random gif",
    usage: "",
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        if (!args[0]) {
            const randomGifSearches = ["random", "question", "games", "fun"];
            console.log("Searches: " + randomGifSearches.slice().join(", "));
            const gifSearch = randomGifSearches[Math.floor((Math.random() * 10) + 1) % randomGifSearches.length]
            console.log("Search: " + gifSearch)
            return giphy.search('gifs', { "q": gifSearch }).then((response) => {
                var responseImage = response.data[Math.floor((Math.random() * 10) + 1) % response.data.length];
                message.channel.send("sending random gif...", {
                    files: [responseImage.images.fixed_height.url]
                }).then(msg => msg.delete({ timeout: 10000 }))
            })
        }
        var gif = args.slice(0).join(" ");
        return giphy.search('gifs', { "q": gif }).then((response) => {
            var responseImage = response.data[Math.floor((Math.random() * 10) + 1) % response.data.length];
            console.log(args.slice(0).join(" "))
            const responceText = `Sending: \`${args.slice(0).join(" ")}\`\n\`\`\`${args.slice(0).join(" ")}\`\`\``
            message.channel.send(responceText, {
                files: [responseImage.images.fixed_height.url]
            }).then(msg => msg.delete({ timeout: 10000 }))
        })
    }
}