const { Command } = require('../../index');
const { RichEmbed } = require('discord.js');

/* eslint-disable class-methods-use-this */
module.exports = class extends Command {

    constructor(...args) {
        super(...args, 'fetch', {
            guildOnly: true,
            permLevel: 1,
            mode: 2,
            cooldown: 30,

            usage: '<message:string{17,21}> [limit:int]',
            usageDelim: ' ',
            description: 'Discover the context of a message.'
        });
    }

    async run(msg, [message, limit = 10]) {
        if (!/^[0-9]{17,21}$/.test(message)) throw msg.language.get('RESOLVER_INVALID_MSG', 'Message');
        const msgs = await msg.channel.fetchMessages({ limit, around: message }).then(messages => Array.from(messages.values()));
        const messages = [];

        for (let i = msgs.length - 1; i > 0; i--) {
            messages.push(`${msgs[i].author.username} ❯ ${msgs[i].cleanContent || '**`IMAGE/EMBED`**'}`);
        }

        const embed = new RichEmbed()
            .setColor(msg.member.highestRole.color || 0xdfdfdf)
            .setTitle(`Context of ${message}`)
            .setDescription(messages)
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ size: 128 }));

        return msg.send({ embed });
    }

};
