module.exports.SlashCommandOptionsType = {
    SUB_COMMAND: 1,
    SUB_COMMAND_GROUP: 2,
    STRING: 3,
    INTEGER: 4,
    BOOLEAN: 5,
    USER: 6,
    CHANNEL: 7,
    ROLE: 8,
    MENTIONABLE: 9,
    NUMBER: 10,
    ATTACHMENT: 11,
};

module.exports.ApplicationCommandTypes = {
    CHAT_INPUT: 1, // default
    USER: 2,
    MESSAGE: 3,
};

module.exports.InteractionContexts = {
    GUILD: 0,
    BOT_DM: 1,
    PRIVATE_CHANNEL: 2,
};

module.exports.IntegrationTypes = {
    GUILD_INSTALL: 0,
    USER_INSTALL: 1,
};