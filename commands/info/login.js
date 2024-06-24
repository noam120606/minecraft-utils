const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const BaseCommand = require("../../structure/components/BaseCommand");
const { SlashCommandOptionsType, InteractionContexts, IntegrationTypes } = require("../../structure/utils/Types");

const commandOpt = {
    name: "login",
};

class Command extends BaseCommand {
    constructor(bot) { super(bot, commandOpt); };

    async run(interaction) {

        const messages = interaction.locales.user.messages.login;

        const mcData = await this.bot.db.getLinkedAccouts(interaction.user.id);
        if (mcData) return interaction.reply({ 
            content: messages.already_linked, 
            ephemeral: true,
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(messages.already_linked_btnlabel)
                            .setEmoji('📤')
                            .setStyle(ButtonStyle.Link)
                            .setURL(this.bot.config.linked.logoutURL)
                    )
            ]
        });
        
        return interaction.reply({
            content: messages.login,
            ephemeral: true,
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(messages.login_btnlabel)
                            .setEmoji('📥')
                            .setStyle(ButtonStyle.Link)
                            .setURL(this.bot.config.linked.loginURL)
                    )
            ]
        });

    };

};

module.exports = Command;