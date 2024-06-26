const express = require('express');
const session = require('express-session'); 
const { readdirSync } = require('fs');

class App {
    constructor(bot, opt) {
        this.bot = bot;
        this.opt = opt;
        this.port = opt.port || 3000;
        this.session_secret = opt.session_secret || 'secret';
        this.app = express();
        this.routes = [];
    }

    loadMiddlewares() {
        this.app.use(express.static(__dirname + '/../../public'));
        this.app.use(session({
            secret: this.session_secret,
            resave: false,
            saveUninitialized: true
        }));
    };

    loadRoutes() {
        const dirs = readdirSync('./routes');

        for (const dir of dirs) {
            const routeFiles = readdirSync(`./routes/${dir}`).filter(file => file.endsWith('.js'));
            for (const file of routeFiles) {
                const Route = require(`../../routes/${dir}/${file}`);
                const route = new Route(this.bot);
                this.routes.push(route);
            };
        };

        this.routes.filter(route => !route.admin).forEach(route => {
            this.app.use(route.path, route.router.bind(route));
        });
        this.app.use((req, res) => {
            if (!req.session.admin) res.redirect('/');
        });
        this.routes.filter(route => route.admin).forEach(route => {
            this.app.use(`/admin/${route.path}`, route.router.bind(route));
        });

    };

    start() {
        this.loadMiddlewares();
        this.loadRoutes();
        this.app.listen(this.port, () => {
            this.bot.log('info', `Webserver started on port ${this.port}`);
        });
    }
}

module.exports = App;