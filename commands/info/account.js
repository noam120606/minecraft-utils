const BaseCommand = require("../../structure/components/BaseCommand");
const { SlashCommandOptionsType, InteractionContexts, IntegrationTypes } = require("../../structure/utils/Types");

const commandOpt = {
    name: "account",
    options: [
        {
            name: "username",
            type: SlashCommandOptionsType.STRING,
        },
        {
            name: "uuid",
            type: SlashCommandOptionsType.STRING,
        },
    ],
};

class Command extends BaseCommand {
    constructor(bot) { super(bot, commandOpt); };

    async run(interaction) {

        const locales = interaction.locales.user.messages.account;

        const username = interaction.options.getString("username");
        const uuid = interaction.options.getString("uuid");

        let player = null;
        if (username) player = await this.bot.players.getByUsername(username);
        else if (uuid) player = await this.bot.players.getByUuid(uuid);
        else player = await this.bot.players.getById(interaction.user.id)

        if (!player) return interaction.reply({ content: locales.no_account, ephemeral: true });

        
        const msg = await player.toMessage(interaction.locales.user.components.player);

        console.log(player.getData());

        return await interaction.reply(msg);

    };

};

module.exports = Command;