const { Client, Collection, Presence } = require("discord.js");
const config = require("./backend/config.json");
const fs = require("fs")

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
            name: `${config.prefix}help | running on: ${client.guilds.cache.size} servers`,
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

    if (command) command.run(client, message, args);
})
client.login("Njk3MzkwMjQ5OTk0NjE2ODkz.XpN_gQ.8yBaB2y2nRRabbtRFomXRelqS5s"/*process.env.token*/);