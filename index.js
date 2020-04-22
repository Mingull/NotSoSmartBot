const { Client, Collection, MessageEmbed } = require("discord.js");
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
    console.log(`Hi, ${client.user.tag} has started.\nserving ${client.users.cache.size} users in ${client.channels.cache.size} channels in ${client.guilds.cache.size} servers\n`);
    client.user.setPresence({
        status: "online",
        afk: false,
        activity: {
            name: `${config.prefix}help | serving: ${client.guilds.cache.size} servers`,
            type: "PLAYING",
        }
    });
    client.guilds.cache.forEach(g => {
        console.log(`serving ${g.name}[${g.nameAcronym}](${g.id}) with ${g.memberCount} users in ${g.channels.cache.size} channel`)
    })
    console.log();
});
client.on("guildMemberAdd", member => {
    const welcomeChannel = member.guild.channels.cache.find(c => c.name == "🤝-welcome" && c.type == "text");
    if (!welcomeChannel) {
        console.log("can't find welcome channel")
    }

    const welcomeEmbed = new MessageEmbed()
        .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL())
        .setDescription(welcomeMessage(member))
        .setColor("GREEN")
        .setFooter(`${member.guild.name}`, member.guild.iconURL())

    welcomeChannel.send(welcomeEmbed);
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

function welcomeMessage(member) {
    const messages = [
        `\`${member.user.username}\` just joined the server - glhf!`, `\`${member.user.username}\` just joined. Everyone, look busy!`,
        `\`${member.user.username}\` just joined. Can I get a heal?`, `\`${member.user.username}\` joined your party.`,
        `\`${member.user.username}\` joined. You must construct additional pylons.`, `Ermagherd. \`${member.user.username}\` is here.`,
        `Welcome, \`${member.user.username}\`. Stay awhile and listen.`, `Welcome, \`${member.user.username}\`. We were expecting you ( ͡° ͜ʖ ͡°)`,
        `Welcome, \`${member.user.username}\`. We hope you brought pizza.`, `Welcome \`${member.user.username}\`. Leave your weapons by the door.`,
        `A wild \`${member.user.username}\` appeared.`, `Swoooosh. \`${member.user.username}\` just landed.`,
        `Brace yourselves. \`${member.user.username}\` just joined the server.`, `\`${member.user.username}\` just joined. Hide your bananas.`,
        `\`${member.user.username}\` just arrived. Seems OP - please nerf.`, `\`${member.user.username}\` just slid into the server.`,
        `A \`${member.user.username}\` has spawned in the server.`, `Big \`${member.user.username}\` showed up!`,
        `Where’s \`${member.user.username}\`? In the server!`, `\`${member.user.username}\` hopped into the server. Kangaroo!!`,
        `\`${member.user.username}\` just showed up. Hold my beer.`, `Challenger approaching - \`${member.user.username}\` has appeared!`,
        `It's a bird! It's a plane! Nevermind, it's just \`${member.user.username}\`.`, `It's \`${member.user.username}\`! Praise the sun! \\\\[T]/`,
        `Never gonna give \`${member.user.username}\` up. Never gonna let \`${member.user.username}\` down.`, `Ha! \`${member.user.username}\` has joined! You activated my trap card!`,
        `Cheers, love! \`${member.user.username}\`'s here!`, `Hey! Listen! \`${member.user.username}\` has joined!`,
        `We've been expecting you \`${member.user.username}\``, `It's dangerous to go alone, take \`${member.user.username}\`!`,
        `\`${member.user.username}\` has joined the server! It's super effective!`, `Cheers, love! \`${member.user.username}\` is here!`,
        `\`${member.user.username}\` is here, as the prophecy foretold.`, `\`${member.user.username}\` has arrived. Party's over.`,
        `Ready player \`${member.user.username}\``, `\`${member.user.username}\` is here to kick butt and chew bubblegum. And \`${member.user.username}\` is all out of gum.`,
        `Hello. Is it \`${member.user.username}\` you're looking for?`, `\`${member.user.username}\` has joined. Stay a while and listen!`,
        `Roses are red, violets are blue, \`${member.user.username}\` joined this server with you`,
    ]
    const message = messages[Math.floor(Math.random() * messages.length)]
    return message
}