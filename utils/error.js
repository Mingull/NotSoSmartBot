const client = require("discord.js");
const fs = require("fs");


module.exports.noPerms = (message, perm) => {
    let embed = new client.MessageEmbed()
        .setAuthor(message.author.username)
        .setTitle("No Permissions!")
        .addField("insufficient permissions", perm);

    message.channel.send(embed).then(msg => msg.delete({ timeout: 5000 }));
}