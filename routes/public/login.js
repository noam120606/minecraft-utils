class Route {
    constructor(bot) {
        this.bot = bot;
        this.admin = false;

        this.path = '/login';
    }

    async router(req, res) {
        const MCconfigs = this.bot.config.apis.mcAuth;
        const DSCconfigs = this.bot.config.apis.discordAuth;

        if (!req.session.mc_data) return res.redirect(`${MCconfigs.authorize}?client_id=${MCconfigs.id}&redirect_uri=${MCconfigs.redirect_uri}&scope=profile&response_type=code`);
        if (!req.session.dsc_data) return res.redirect(`${DSCconfigs.authorize}?client_id=${DSCconfigs.id}&redirect_uri=${DSCconfigs.redirect_uri}&scope=identify&response_type=code`);

        const language = await this.bot.db.getLanguage(req.session.dsc_data.id);
        const locales = this.bot.locales.get(language) ?? this.bot.locales.get(this.bot.config.default_language);
        const messages = locales.messages.webserver.login;

        await this.bot.db.setLinkedAccouts(req.session.dsc_data.id, req.session.mc_data.id);

        res.send(`${messages.title}<br><br><a href="/logout">${messages.logout}</a>`);
        
    }
}

module.exports = Route; 