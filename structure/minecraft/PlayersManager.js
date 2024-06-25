const Player = require("./Player");

class PlayersManager {
    constructor(bot) {
        this.bot = bot;
    }

    async getByUsername(username) {
        const uuid = (await MinecraftRequest(`https://api.mojang.com/users/profiles/minecraft/${username}`, {}, this.bot))?.id;
        if (!uuid) return null;
        return await this.getByUuid(uuid);
    };

    async getById(userId) {
        const mcData = await this.bot.db.getLinkedAccouts(userId);
        if (!mcData) return null;
        return await this.getByUuid(mcData[0].uuid);
    };

    async getByUuid(uuid) {
        const player = new Player(this.bot, uuid);
        await player.init();
        return player;
    };
}

module.exports = PlayersManager;