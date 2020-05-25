const { Client, MessageEmbed } = require('discord.js');
const { getMember } = require("../../backend/functions");
const { wordCountString } = require("../../backend/config.json");
const database = require("../../backend/database.json");
const mysql = require("mysql")

module.exports = {
    name: 'count',
    aliases: [],
    category: 'information',
    description: `Show you how much you(or mentioned member) said **\`\`\`wordCountString\`\`\`**`,
    usage: "",
    private: false,
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        var conn = mysql.createConnection({
            host: database.host,
            user: database.user,
            password: database.password,
            database: database.db
        });
        conn.connect(err => {
            if (err) throw err
        });
        const member = getMember(message, args.join(" "));
        const memberId = member.id;

        if (memberId == message.author.id) {
            conn.query(`SELECT * FROM message_counter WHERE member_id = "${member.id}"`, (err, rows) => {
                if (err) throw err;
                message.channel.send(`You said __\`${wordCountString}\`__ **${rows[0].count}** times`).then(msg => msg.delete({ timeout: 3000 }))
            })
        }
        else {
            conn.query(`SELECT * FROM message_counter WHERE member_id = "${member.id}"`, (err, rows) => {
                if (err) throw err;
                message.channel.send(`${member.user.tag} said __\`${wordCountString}\`__ **${rows[0].count}** times`).then(msg => msg.delete({ timeout: 3000 }))
            })
        }
    }
}