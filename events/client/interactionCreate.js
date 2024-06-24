const { Events, InteractionType, PermissionsBitField } = require('discord.js');
const BaseEvent = require('../../structure/components/BaseEvent');

class Event extends BaseEvent {
    constructor(bot) { super(bot, Events.InteractionCreate) };
    
    async run(s, interaction) {

        interaction.locales = {
            user: this.bot.locales.find(l => l.languages.includes(interaction.locale)) ?? this.bot.locales.get(this.bot.config.default_language),
            guild: this.bot.locales.find(l => l.languages.includes(interaction.guildLocale)) ?? this.bot.locales.get(this.bot.config.default_language),
        };

        this.bot.db.setLanguage(interaction.user.id, interaction.locale);
    
        switch (interaction.type) {

            case InteractionType.ApplicationCommand:

                const command = this.bot.commands.get(interaction.commandName);

                await command.run(interaction);
		        this.bot.log('info',`Command "${interaction.commandName}" used by user "${interaction.user.id}"`);

            break;

            case InteractionType.ApplicationCommandAutocomplete:

                const autocompleteManager = this.bot.commands.get(interaction.commandName).autocomplete;
                autocompleteManager(this.bot, interaction);

            break;

            default:

            

                const name = interaction.customId.split("_")[0];
                const args = interaction.customId.split("_").slice(1);
                const file = this.bot.interactions.find(i => i.name === name && i.type === interaction.type);

                if (!file) return;

                if (file.permission && !interaction.member.permissions.has(new PermissionsBitField(file.permission))) return await interaction.reply({
                    content: interaction.locales.user.messages.misc.no_perm_interaction.replace("{{perm}}", new PermissionsBitField(file.permission).toArray()),
                    ephemeral: true
                });

                await file.run(interaction, ...args);

            break;
        };

    };
};

module.exports = Event;