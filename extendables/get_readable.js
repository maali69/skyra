const { Extendable } = require('../index');

module.exports = class extends Extendable {

    constructor(...args) {
        super(...args, ['GroupDMChannel', 'DMChannel', 'TextChannel'], { name: 'readable' });
    }

    get extend() {
        if (!this.guild) return true;
        return this.permissionsFor(this.guild.me).has('READ_MESSAGES');
    }

};
