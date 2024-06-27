const { readFileSync } = require('fs');

class Route {
    constructor(bot) {
        this.bot = bot;
        this.admin = false;

        this.path = '/logout';
    };

    async router(req, res) {

        if (!req.query.id) return res.redirect('/login');
        if (!req.query.token) return res.redirect('/login');

        const token = this.bot.webserver.logout_tokens.get(req.query.id);
        if (token !== req.query.token) return res.redirect('/login');

        const language = await this.bot.db.getLanguage(req.query.id);
        const locales = this.bot.locales.get(language) ?? this.bot.locales.get(this.bot.config.default_language);
        const messages = locales.messages.webserver.logout;

        await this.bot.db.destroyLinkedAccouts(req.query.id);
        this.bot.webserver.logout_tokens.delete(req.query.id);
        
        req.session.mc_data = null;
        req.session.dsc_data = null;

        let content = readFileSync('./public/login.html', 'utf8');
        res.send(content.replace('{{content}}', messages.title));
        
    };
};

module.exports = Route;