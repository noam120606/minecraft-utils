class MinecraftServer {
    constructor(bot, data) { this.raw = data; this.bot = bot };

    get debug() { return this.raw.debug };
    get online() { return this.raw.online };
    get ip() { return this.raw.ip };
    get port() { return this.raw.port };
    get connect() { return this.ip + ':' + this.port };
    get image () { 
        return {
            png: this.icon ?? null, // base64
            url: this.raw.avatarUrl,
        };
    };
    get players() { 
        if (!this.online) return undefined; 
        return { 
            string: `${this.raw.players.online} / ${this.raw.players.max}`, 
            list: this.raw.players.list
        };
    };
    get software() { return this.raw.software };
    get version() { 
        if (!this.online) return undefined;
        return this.raw.version 
    };
    get addons() {
        if (!this.online) return undefined;
        const response = { plugins: null, mods: null };
        if (this.raw.plugins) response.plugins = this.raw.plugins;
        if (this.raw.mods) response.mods = this.raw.mods;
        return response;
    };
    get isBedrock() { 
        if (!this.online) return undefined;
        return this.raw.serverId ? true : false;
    };
    get motd() { 
        if (!this.online) return undefined;
        return this.raw.motd.clean;
    };
    get info() {
        if (!this.online) return undefined;
        return this.raw.info.clean;
    }

    async addFavourite(userId) { return await this.bot.db.addServerFavourite(this.ip, userId); }
    async removeFavourite(userId) { return await this.bot.db.removeServerFavourite(this.ip, userId); }

};

module.exports = MinecraftServer;

/*

	"motd": {
		"raw": [
			"\u00a7cEver\u00a7r\u00a79PvP \u00a7r\u00a77- \u00a7r\u00a72\u00c9n server, for alle",
			"\u00a7r\u00a7fSe dine stats p\u00e5 \u00a7r\u00a76stats.everpvp.dk\u00a7r"
		],
		"clean": [
			"EverPvP - \u00c9n server, for alle",
			"Se dine stats p\u00e5 stats.everpvp.dk"
		],
*/