class Route {
    constructor(bot) {
        this.bot = bot;
        this.admin = false;

        this.path = '/callback/mc';
    }

    async router(req, res) {

        const configs = this.bot.config.apis.mcAuth;
        if (!req.query.code) return res.redirect('/login');

        const response = await fetch(configs.token, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': this.bot.config.agent,
            },
            body: JSON.stringify({
                client_id: configs.id,
                client_secret: configs.secret,
                grant_type: 'authorization_code',
                code: req.query.code,
                redirect_uri: configs.redirect_uri,
            }),
        });

        const data = await response.json();
        if (data.error) return res.redirect('/login');

        req.session.mc_data = data.data.profile;

        res.redirect('/login');
    }
}

module.exports = Route;