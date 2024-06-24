const BaseEvent = require('../../structure/components/BaseEvent');

class Event extends BaseEvent {
    constructor(bot) { super(bot, "unhandledRejection") };
    
    async run(error) {
        this.bot.log('error', error);
    };
};

module.exports = Event;