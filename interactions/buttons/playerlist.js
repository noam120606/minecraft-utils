const { InteractionType } = require("discord.js");

class Button {
    constructor(bot) {
        this.bot = bot;
        this.name = "playerlist";
        this.type = InteractionType.MessageComponent;
    };

    async run(interaction, ip) {

        const server = await this.bot.mc.servers.get(ip);
        const list = server.players.list;

        const playerlist = interaction.locales.user.messages.status.buttons.playerlist;

        if (!list) return interaction.reply({ content: playerlist.no_list, ephemeral: true });

        console.log(list)

    };
}

module.exports = Button;