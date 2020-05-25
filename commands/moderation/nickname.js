const { MessageEmbed } = require("discord.js")
const { getMember } = require("../../backend/functions.js")
const { prefix, } = require("../../backend/config.json")
const database = require("../../backend/database.json")
const mysql = require("mysql")

module.exports = {
    name: "nickname",
    aliases: ["nick"],
    category: 'moderation',
    description: ``,
    usage: "",
    private: true,
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


        //var member = getMember(message, args.join(" "));
        var member = message.guild.member(message.mentions.users.first())
        var nickname = args.slice(1).join(" ");

        if (member && !nickname) {
            conn.query(`SELECT member_nick FROM nickname WHERE member_id = "${member.id}"`, (err, rows) => {
                if (err) throw err;
                if (rows.length > 0) {
                    var memberId = rows[0].member_id
                    message.channel.send(`nickname: ${rows[0].member_nick}`);
                } else {
                    message.channel.send(`There are no nicknames.\ncreate one by doing: ${prefix}nick <mention | name> <nickname | remove>`)
                }
            })
        }
        else if (member && nickname == "remove") {
            conn.query(`DELETE FROM nickname WHERE member_id = "${member.id}"`, (err, rows) => {
                if (err) throw err;

            }).then(msg => msg.channel.send(`Removed nickname from ${message.guild.members.cache.get(memberId).user.username}`))
        }
        else if (member && nickname) {
            conn.query(`SELECT * FROM nickname WHERE member_id = '${member.id}'`, (err, rows) => {
                if (err) throw err;

                if (rows.length < 1) {
                    conn.query(`INSERT INTO nickname (member_id, member_nick) VALUES ("${member.id}", "${nickname}")`)
                } else {
                    conn.query(`UPDATE nickname SET member_nick = '${nickname}' WHERE member_id = '${member.id}'`)
                }
            });
        }
        else {
            conn.query(`SELECT * FROM nickname`, (err, rows) => {
                if (err) throw err;
                if (rows.length > 0) {
                    const nicknamesEmbed = new MessageEmbed()
                    .setColor()
                    for (var i = 0; i < rows.length; i++) {
                        var memberId = rows[i].member_id
                        var memberName = message.guild.members.cache.get(memberId).user.username;
                        var memberNick = rows[i].member_nick
                        nicknamesEmbed.addField(`Name: ${memberName}`, `Nickname: ${memberNick}`);
                    }
                    console.log(`${nicknamesEmbed}`)
                    message.channel.send(nicknamesEmbed);
                } else {
                    message.channel.send(`There are no nicknames.\ncreate one by doing: ${prefix}nick <mention | name> <nickname | remove>`)
                }
            })
        }
    }
}