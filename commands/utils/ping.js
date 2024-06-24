const BaseCommand = require("../../structure/components/BaseCommand");

const commandOpt = {
    name: "ping",
}


class Command extends BaseCommand {
    constructor(bot) { super(bot, commandOpt); };

    async run(interaction) {
        interaction.reply(interaction.locales.user.messages.ping.main_reply.replace("{{ping}}", this.bot.ws.ping));
    }

}

module.exports = Command;