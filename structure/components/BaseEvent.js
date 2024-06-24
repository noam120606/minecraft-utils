class BaseEvent {
    constructor(bot, name, type) {
        this.bot = bot;
        this.name = name;
        this.type = type;
    }
}

module.exports = BaseEvent;