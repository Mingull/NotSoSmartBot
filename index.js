const { Client, Collection, Presence } = require("discord.js");
const config = require("./backend/config.json");
const fs = require("fs");

const active = new Map();

const client = new Client({
    disableEveryone: true
});

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

client.on("ready", () => {
    console.log(`Hi, ${client.user.tag} has started.\nserving ${client.users.cache.size} users in ${client.channels.cache.size} channels in ${client.guilds.cache.size} servers`);
    client.user.setPresence({
        status: "online",
        afk: false,
        activity: {
            name: `${config.prefix}help | serving: ${client.guilds.cache.size} servers`,
            type: "PLAYING",
        }
    })
});
client.on("message", async message => {
    const prefix = config.prefix;
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message)

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    var options = {
        active: active
    }

    if (command) command.run(client, message, args, options);
})
client.login(process.env.token);