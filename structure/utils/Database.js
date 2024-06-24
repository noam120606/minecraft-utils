const { createConnection } = require('mysql');

class Database {
    constructor(bot) {
        if (!process.env.MYSQL_HOST) return null;
        if (!process.env.MYSQL_USER) return null;
        if (!process.env.MYSQL_PASSWORD) return null;
        if (!process.env.MYSQL_DATABASE) return null;

        this.bot = bot;

        this.connection = createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: process.env.MYSQL_PORT ?? 3306,
        });

        setInterval(() => {
            this.connection.query('SELECT 1;');
        }, 6 * 60 * 60 * 1000);

        this.connection.connect();
    };

    get raw() {
        return this.connection;
    };
    async stop() {
        await this.connection.end();
    };

    async addWebhook(id, channel, name, token) {
        return await this._query('INSERT INTO webhooks VALUES (?, ?, ?, ?);', [id, channel, name, token]);
    };
    async getWebhook(channel) {
        return await this.query('SELECT * FROM webhooks WHERE channel = ?;', [channel]);
    };

    async addServerFavourite(ip, userId) {
        return await this.query('INSERT INTO favourite_servers VALUES (?, ?);', [userId, ip]);
    };
    async removeServerFavourite(ip, userId) {
        return await this.query('DELETE FROM favourite_servers WHERE ip = ? AND user = ?;', [ip, userId]);
    };
    async getServerFavourites(userId) {
        return await this.query('SELECT * FROM favourite_servers WHERE userId = ?;', [userId]);
    };
    async setLanguage(userId, language) {
        const current = await this.query('SELECT language FROM languages WHERE id = ?;', [userId]);
        if (current) {
            if (current[0].language == language) return;
            await this.query('UPDATE languages SET language = ? WHERE id = ?;', [language, userId]);
        }
        else await this.query('INSERT INTO languages VALUES (?, ?);', [userId, language]);
        
    };
    async getLanguage(userId) {
        const language = await this.query('SELECT language FROM languages WHERE id = ?;', [userId]);
        if (!language) return this.bot.config.default_language;
        if (language.length < 1) return this.bot.config.default_language;
        return language[0].language;
    };
    async setLinkedAccouts(userId, uuid) {
        const hasuuid = await this.query('SELECT uuid FROM linked WHERE user = ?;', [userId]);
        if (hasuuid) await this.query('UPDATE linked SET uuid = ? WHERE user = ?;', [uuid, userId]);
        else await this.query('INSERT INTO linked VALUES (?, ?);', [userId, uuid]);
    };
    async destroyLinkedAccouts(userId) {
        return await this.query('DELETE FROM linked WHERE user = ?;', [userId]);
    };
    async getLinkedAccouts(userId) {
        return await this.query('SELECT * FROM linked WHERE user = ?;', [userId]);
    };

    async query(sql, params=[]) {
        this.bot.log('info', `SQL request completed : \`${sql}\`${params.length ? ` | Params : \`${params.join(', ')}\`` : ''}`);
        return new Promise((resolve, reject) => {
            this.connection.query(sql, params, (err, res) => {
                if (err) return reject(err);
                if (res.length < 1) return resolve(null);
                resolve(res);
            });
        });
    };

};

module.exports = Database;
