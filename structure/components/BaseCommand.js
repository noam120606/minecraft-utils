const { SlashCommandBuilder } = require('discord.js');

class BaseCommand {
    constructor(bot, options = null) {
        this.bot = bot;
        this.data = options ?? new SlashCommandBuilder();
    }
}

module.exports = BaseCommand;