const BaseEvent = require('../../structure/components/BaseEvent');

class Event extends BaseEvent {
    constructor(bot) { super(bot, "beforeExit") };
    
    async run() {
        this.bot.log('info', `Shutting down...`);
        await this.bot.stop();
        this.bot.log('info', `Shut down completed.`);
    };
};

module.exports = Event;