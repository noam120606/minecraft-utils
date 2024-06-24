class Route {
    constructor(bot) {
        this.bot = bot;
        this.admin = false;

        this.path = '/logout';
    };

    async router(req, res) {

        if (!req.session.dsc_data) return res.redirect('/login');
        if (!req.session.mc_data) return res.redirect('/login');

        const language = await this.bot.db.getLanguage(req.session.dsc_data.id);
        const locales = this.bot.locales.get(language) ?? this.bot.locales.get(this.bot.config.default_language);
        const messages = locales.messages.webserver.logout;

        await this.bot.db.destroyLinkedAccouts(req.session.dsc_data.id);
        
        req.session.mc_data = null;
        req.session.dsc_data = null;

        res.send(messages.title);
        
    };
};

module.exports = Route;