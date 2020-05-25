const { Client, Collection, MessageEmbed } = require("discord.js");
const { prefix, wordCountString, colors } = require("./backend/config.json");
const { getMember, welcomeMessage } = require("./backend/functions.js");
const database = require("./backend/database.json");
const mysql = require("mysql")
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
            name: `${prefix}help | serving: ${client.guilds.cache.size} servers`,
            type: "PLAYING",
        }
    });
    let num = 0;
    const colors = ["\x1b[36m%s\x1b[0m", "\x1b[32m%s\x1b[0m"];
    var color;
    client.guilds.cache.forEach((g) => {
        const isOdd = num % 2;
        if (isOdd == 0) {
            color = colors[0];
        } else {
            color = colors[1];
        }
        console.log(color, `serving ${g.name}[${g.nameAcronym}](${g.id}) with ${g.memberCount} users in ${g.channels.cache.size} channel`);
        num += 1;
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
    // WORD COUNTER!
    if (message.author.bot) return;
    if (message.content.startsWith(prefix)) return;

    var _regex = new RegExp(wordCountString, "g"); // it will look like this: /word/g
    var word = message.content.toString(); // gets the content of the message
    if (word.match(_regex)) {
        var count = (word.match(_regex) || []).length; // this goes and matches the string with the _regex var

        var authorId = message.author.id.toString();
        var authorDisc = message.author.discriminator.toString();
        var authorName = message.author.username.toString();
        var conn = mysql.createConnection({
            host: database.host,
            user: database.user,
            password: database.password,
            database: database.db
        });
        conn.connect(err => {
            if (err) console.log(err);
        });
        conn.query(`SELECT * FROM message_counter WHERE member_id = "${authorId}"`, (err, rows) => {
            if (err) console.log(err);
            if (rows < 1) {
                conn.query(`INSERT INTO message_counter (member_id, member_name, \`count\`) VALUES ("${authorId}", "${authorName}", ${count})`)
            }
            else {
                conn.query(`SELECT \`count\` FROM message_counter WHERE member_id = "${authorId}"`, (err, rows) => {
                    if (err) console.log(err);
                    let oldCount = rows[0].count
                    conn.query(`UPDATE message_counter SET \`count\` = ${oldCount + count} WHERE member_id = "${message.author.id}"`)
                    console.log(`${oldCount} + ${count} = ${oldCount + count}`);

                    const saidWordChannel = message.guild.channels.cache.find(c => c.name == "said-word" && c.type == "text");
                    if (!saidWordChannel) return;

                    saidWordChannel.send(`${message.author.tag} said __\`${wordCountString}\`__ **${oldCount + count}** times`);
                })

            }
        })
    }
})

client.on("message", async message => {
    // LEVELING SYSTEM!
    if (message.author.bot) return;
    if (message.content.startsWith(prefix)) return;

    var conn = mysql.createConnection({
        host: database.host,
        user: database.user,
        password: database.password,
        database: database.db
    });

    conn.connect(err => {
        if (err) console.log(err);
    });

    let expAdd = Math.floor(Math.random() * 7) + 8;
    console.log(expAdd);
    conn.query(`SELECT * FROM level WHERE member_id = ${message.author.id}`, (err, rows) => {
        if (err) console.log(err);
        if (rows < 1) {
            conn.query(`INSERT INTO level (member_id, member_exp) VALUES ("${message.author.id}", "${expAdd}")`);
        } else {
            let curLvl = rows[0].member_level;
            let curExp = rows[0].member_exp;
            let nxtLvl = curLvl * 110;

            conn.query(`UPDATE level SET member_exp = ${curExp + expAdd} WHERE member_id = "${message.author.id}"`);

            if (nxtLvl <= (curExp + expAdd)) {
                conn.query(`UPDATE level SET member_level = ${curLvl + 1} WHERE member_id = "${message.author.id}"`);

                var lvlIndex = Math.floor(nxtLvl / 11)
                var lvlProgress = "✅".repeat(lvlIndex) + "❌".repeat(10 - lvlIndex);

                const lvlUp = new MessageEmbed()
                    .setTitle("Level Up!📈")
                    .setColor(colors.limeGreen)
                    .addField("Current Level", curLvl + 1)
                    .addField("Current Exp", (curExp + expAdd))
                    .addField("Progress", `${(curLvl + 1) * 111} Exp\n\n${lvlProgress}`)
                message.author.send(lvlUp)
            }
        }
    })
})

client.on("message", async message => {
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
});

client.login("Njk3MzkwMjQ5OTk0NjE2ODkz.Xpcxug.Ppi-OZ00QCyfRbP_EzqP5XfwJ6c" /*process.env.token*/);