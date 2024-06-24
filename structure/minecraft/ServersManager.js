const MinecraftServer = require('./MinecraftServer');

class ServersManager {
    constructor(bot) {
        this.bot = bot;
    }

    async get(ip) {
        const { serverInfo, serverAvatar} = this.bot.config.apis;
        const infoResponse = await fetch(serverInfo.baseUrl + '/' + serverInfo.version + '/' + ip);
        const infoData = await infoResponse.json();
        infoData.avatarUrl = serverAvatar.baseUrl + ip;

        return new MinecraftServer(this.bot, infoData);
    };

    async getFavourites(userId) {
        const response = await this.bot.db.getServerFavourites(userId);
        return response.map(async server => await this.get(server.ip));
    };
};

module.exports = ServersManager;