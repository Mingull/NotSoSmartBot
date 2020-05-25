module.exports = {
    getMember: function (message, toFind = '') {
        toFind = toFind.toLowerCase();
        let target = message.guild.members.cache.get(toFind);
        if (!target && message.mentions.members)
            target = message.mentions.members.first();
        if (!target && toFind) {
            target = message.guild.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                    member.user.tag.toLowerCase().includes(toFind)
            });
        }
        if (!target)
            target = message.member
        return target
    },

    formatDate: function (date) {
        return new Intl.DateTimeFormat('en-US').format(date);
    },

    promptMessage: async function (message, author, time, validReaction) {
        time *= 1000;

        for (const reaction of validReaction) await message.react(reaction);

        const filter = (reaction, user) => validReaction.includes(reaction.emoji.name) && user.id === author.id;

        return message
            .awaitReactions(filter, { max: 1, time: time })
            .then(collected => collected.first() && collected.first().emoji.name);
    },
    welcomeMessage: function (member) {
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
}