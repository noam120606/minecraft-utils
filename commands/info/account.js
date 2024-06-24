const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const BaseCommand = require("../../structure/components/BaseCommand");
const { SlashCommandOptionsType, InteractionContexts, IntegrationTypes } = require("../../structure/utils/Types");

const commandOpt = {
    name: "account",
};

class Command extends BaseCommand {
    constructor(bot) { super(bot, commandOpt); };

    async run(interaction) {

        const messages = interaction.locales.user.messages.account;

        const mcData = await this.bot.db.getLinkedAccouts(interaction.user.id);
        if (!mcData) return interaction.reply({ content: messages.no_account, ephemeral: true });
        const uuid = mcData[0].uuid;

        interaction.reply({
            content: uuid,  
            ephemeral: true,
        });
    };

};

module.exports = Command;