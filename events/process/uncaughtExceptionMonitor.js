const BaseEvent = require('../../structure/components/BaseEvent');

class Event extends BaseEvent {
    constructor(bot) { super(bot, "uncaughtExceptionMonitor") };
    
    async run(error) {
        this.bot.log('error', error);
    };
};

module.exports = Event;