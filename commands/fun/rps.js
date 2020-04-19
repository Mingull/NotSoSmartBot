const { Client, MessageEmbed } = require('discord.js');
const { promptMessage } = require("../../backend/functions.js");
const chooseArr = ["🗻", "📃", "✂"];
module.exports = {
    name: "rps",
    aliases: ["rps"],
    category: "fun",
    description: "Rock Paper Scissors game.\nReact to one of the emojisto play the game.",
    usage: "",
    private: false,
    run: async (client, message, args) => {
        if(message.deletable) message.delete();
        const embed = new MessageEmbed()
            .setColor("#FFFFFF")
            .setFooter(message.guild.me.displayName, client.user.displayAvatarURL())
            .setDescription("Add a reaction to one of these emojis to play the game!")
            .setTimestamp();

        const m = await message.channel.send(embed);
        const reacted = await promptMessage(m, message.author, 30, chooseArr);
        const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

        const result = await getResult(reacted, botChoice);
        await m.reactions.removeAll().catch(err => console.error("Failed to clear emojis: ", err));

        embed
            .setDescription("")
            .addField(result, `${reacted} vs ${botChoice}`);
        m.edit(embed);

        function getResult(me, clientChosen) {
            if ((me === "🗻" && clientChosen === "✂") ||
                (me === "📃" && clientChosen === "🗻") ||
                (me === "✂" && clientChosen === "📃")) {
                return "You won!";
            } else if (me === clientChosen) {
                return "It's a tie!";
            } else {
                return "You lost!";
            }
        }
    }
}