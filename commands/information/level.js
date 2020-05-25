const { MessageEmbed } = require("discord.js")
const { colors } = require("../../backend/config.json")
const database = require("../../backend/database.json")
const { getMember } = require("../../backend/functions.js")
const mysql = require("mysql")

module.exports = {
    name: "level",
    aliases: ["lvl"],
    category: 'information',
    description: "Shows you the current level and exp from you or a member. also shows you how much exp to go for next level up!",
    usage: "[mention | member]",
    private: false,
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        const member = getMember(message, args.join(" "));

        var conn = mysql.createConnection({
            host: database.host,
            user: database.user,
            password: database.password,
            database: database.db
        });

        conn.connect(err => {
            if (err) console.log(err)
        });

        conn.query(`SELECT * FROM level WHERE member_id = "${member.id}"`, (err, rows) => {
            if (err) console.log(err);

            if (rows < 1) {
                return message.channel.send(`${member.user.username} `)
            } else {
                let curLvl = rows[0].member_level;
                let curExp = rows[0].member_exp;
                let nxtLvl = curLvl * 110;

                // var lvlIndex = Math.floor(nxtLvl / 11)
                // var lvlProgress = "✅".repeat(lvlIndex) + "❌".repeat(10 - lvlIndex);

                const lvlUp = new MessageEmbed()
                    .setTitle("Level Up!📈")
                    .setColor(colors.limeGreen)
                    .addField("Current Level", curLvl)
                    .addField("Current Exp", curExp)
                // .addField("Progress", `${nxtLvl} Exp\n\n${lvlProgress}`)
                message.channel.send(lvlUp)
            }
        })
    }
}