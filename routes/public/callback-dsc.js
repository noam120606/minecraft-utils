class Route {
    constructor(bot) {
        this.bot = bot;
        this.admin = false;

        this.path = '/callback/dsc';
    }

    async router(req, res) {

        const configs = this.bot.config.apis.discordAuth;
        if (!req.query.code) return res.redirect('/login');

        const response = await fetch(configs.token, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'User-Agent': this.bot.config.agent,
            },
            body: new URLSearchParams({
                client_id: configs.id,
                client_secret: configs.secret,
                grant_type: 'authorization_code',
                code: req.query.code,
                redirect_uri: configs.redirect_uri,
                scope: 'identify',
            }),
        });

        const tokens = await response.json();
        if (tokens.error) return res.redirect('/login');

        const user_response = await fetch('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${tokens.access_token}`,
            },
        });

        const data = await user_response.json();
        if (data.error) return res.redirect('/login');

        req.session.dsc_data = data;
        if (this.bot.config.ownersIds.includes(data.id)) req.session.admin = true;

        res.redirect('/login');
    }
}

module.exports = Route;