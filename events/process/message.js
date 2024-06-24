const BaseEvent = require('../../structure/components/BaseEvent');

class Event extends BaseEvent {
    constructor(bot) { super(bot, "message") };
    
    async run(message) {
        this.bot.log('info', message);
    };
};

module.exports = Event;