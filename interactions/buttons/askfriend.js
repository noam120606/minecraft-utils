const { InteractionType } = require("discord.js");

class Button {
    constructor(bot) {
        this.bot = bot;
        this.name = "friend";
        this.type = InteractionType.MessageComponent;
    };

    async run(interaction, type, uuid) {

        console.log(uuid);

        switch (type) {
            case "ask": {
                const player = await this.bot.players.getByUuid(uuid);
                if (!player) return interaction.reply({ content: "Player not found", ephemeral: true });
                if (player.uuid === interaction.user.id) return interaction.reply({ content: "You can't ask yourself a friend", ephemeral: true });
            };
            break;
        }

        

    };
}

module.exports = Button;