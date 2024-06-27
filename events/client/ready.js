const { Events } = require('discord.js');
const DiscordRequest = require('../../functions/DiscordRequest');
const BaseEvent = require('../../structure/components/BaseEvent');

class Event extends BaseEvent {
    constructor(bot) { super(bot, Events.ClientReady) };
    
    async run() {
        await DiscordRequest(`applications/${this.bot.user.id}/commands`, { 
            method: 'PUT',
            body: this.bot.commands.map(cmd => cmd.data) 
        }, this.bot);

        this.bot.log('info', `Logged in as "${this.bot.user.username}"`);
    };
};

module.exports = Event;