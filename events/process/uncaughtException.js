const BaseEvent = require('../../structure/components/BaseEvent');

class Event extends BaseEvent {
    constructor(bot) { super(bot, "uncaughtException") };
    
    async run(error) {
        this.bot.log('error', error);
    };
};

module.exports = Event;