const { Extendable } = require('../index');

module.exports = class extends Extendable {

    constructor(...args) {
        super(...args, ['Message'], { name: 'guildSettings' });
    }

    get extend() {
        return this.guild ? this.guild.settings : { prefix: 's!', disabledCommands: [] };
    }

};
