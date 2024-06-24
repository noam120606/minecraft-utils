const { Client, Collection, IntentsBitField, Events, WebhookClient } = require('discord.js');
const { InteractionContexts, IntegrationTypes } = require('../utils/Types');
const { readdirSync } = require('fs');
const config = require('../../config.js');

const Database = require('../utils/Database.js');
const WebhookManager = require('./Webhooks.js');
const ServersManager = require('../minecraft/ServersManager.js');
const WebServer = require('../webserver/app.js');

class Bot extends Client {
    constructor(opt = {}) {
        /**
         * opt = {
         *  token: '',
         *  intents: new IntentsBitField(),
         *  disable_commands: false,
         *  disable_events: false,
         *  disable_db: false,
         *  disable_interactions: false,
         *  disable_servers: false,
         *  disable_webserver: false,
         *  port: 3000,
         *  session_secret: 'secret',
         *  id: '',
         *  logURL: '',
         * }
         */

        if (!opt.intents) opt.intents = new IntentsBitField();
        super(opt);

        this.opt = opt;
        this.config = config;
        this.token = opt.token ?? config.token;
        this.id = opt.id;
        this.log_webhook = opt.logURL ? new WebhookClient({ url: opt.logURL }) : null;

        this.log('info', 'Starting...');

        this.env = process.env.NODE_ENV || 'development';
        this.dev = this.env === 'development';
        this.commands = new Collection();
        this.interactions = new Collection();
        this.components = new Collection();
        this.locales = new Collection();

        this.mc = {};
        if (!opt.disable_servers) this.mc.servers = new ServersManager(this);
        if (!opt.disable_db) this.db = new Database(this);
        if (!opt.disable_webhooks) this.webhooks = new WebhookManager(this);
        if (!opt.disable_webserver) this.webserver = new WebServer(this, opt);
        

        this.on(Events.ClientReady, async () => {
            if (this.user.id != this.id) {
                await this.destroy();
                throw new Error('Bot ID is not the same as the provided ID');
            }
        });
    };

    async start() {
        if (!this.token) throw new Error('No token provided !');
        if (!this.opt.disable_locales) await this.loadLocales();
        if (!this.opt.disable_commands) await this.loadCommands();
        if (!this.opt.disable_interactions) await this.loadInteractions();
        if (!this.opt.disable_events) await this.loadEvents();
        if (!this.opt.disable_webserver) await this.webserver.start();

        await this.login(this.token);
    };

    async restart() {
        this.log('info', 'Restarting...');
        await this.destroy();
        await this.login(this.token);
    };

    log(type, msg) {
        /**
         * log the message in console and send it in the log channel
         * @param {string} type 'log' | 'error' | 'warn' | 'info'
         * @param {string} msg the message
        */

        if (this.opt.identify_logs) msg = `${this.user.username} | ${msg}`;

        if (!['log', 'error', 'warn', 'info'].includes(type.toLowerCase())) throw new Error('Invalid log type !\nlog | error | warn | info');

        console[type.toLowerCase()](msg);

        if (!this.log_webhook) return;

        this.log_webhook.send({
            content: `[${type.toUpperCase()}] ${msg}`,
        });
    };

    loadCommands() {
        const categorys = readdirSync('./commands');
        let count = 0;

        for (const category of categorys) {
            const commandFiles = readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const Command = require(`../../commands/${category}/${file}`);
                const cmd = new Command(this);
                if (!cmd.data.integration_types) cmd.data.integration_types = [IntegrationTypes.USER_INSTALL, IntegrationTypes.GUILD_INSTALL];
                if (!cmd.data.contexts) cmd.data.contexts = [InteractionContexts.GUILD, InteractionContexts.PRIVATE_CHANNEL, InteractionContexts.BOT_DM];

                // loading localizations
                // all languages here : https://discord.com/developers/docs/reference#locales
                cmd.data.name_localizations = {};
                cmd.data.description_localizations = {};
                for (const locale of this.locales.values()) {
                    for (const language of locale.languages) {
                        if (language == this.config.default_language) {
                            cmd.data.description = locale.commands[cmd.data.name].description;
                            if (cmd.data.options) for (const option of cmd.data.options) {
                                option.description = locale.commands[cmd.data.name].options[option.name].description;
                            };
                        };
                        cmd.data.name_localizations[language] = locale.commands[cmd.data.name].name;
                        cmd.data.description_localizations[language] = locale.commands[cmd.data.name].description;
                        if (cmd.data.options) for (const option of cmd.data.options) {
                            if (!option.name_localizations) option.name_localizations = {};
                            if (!option.description_localizations) option.description_localizations = {};
                            option.name_localizations[language] = locale.commands[cmd.data.name].options[option.name].name;
                            option.description_localizations[language] = locale.commands[cmd.data.name].options[option.name].description;
                        }
                    };
                };

                cmd.category = category;
                this.commands.set(cmd.data.name, cmd);
                count++;
            };

        };

        this.log('info', `Loaded ${count} commands`);
    };

    loadEvents() {
        const eventDirs = readdirSync('./events');
        let count = 0;

        for (const dir of eventDirs) {
            const eventFiles = readdirSync(`./events/${dir}`).filter(file => file.endsWith('.js'));

            for (const file of eventFiles) {
                const Event = require(`../../events/${dir}/${file}`);
                const event = new Event(this);

                if (dir === 'client') this.on(event.name, event.run.bind(event, null));
                // if (dir === 'process') process.on(event.name, event.run.bind(event, null));
                
                count++;
            };

        };
        
        this.log('info', `Loaded ${count} events`);
    };

    loadInteractions() {
        const interactionsDirs = readdirSync('./interactions');
        let count = 0;

        for (const dir of interactionsDirs) {
            const interactionsFiles = readdirSync(`./interactions/${dir}`).filter(file => file.endsWith('.js'));

            for (const file of interactionsFiles) {
                const Interaction = require(`../../interactions/${dir}/${file}`);
                const interaction = new Interaction(this);
                
                this.interactions.set(interaction.name, interaction);
                count++;
            }
        }

        this.log('info', `Loaded ${count} interactions`);
    };

    loadLocales() {
        const localesDirs = readdirSync('./locales');
        let count = 0;

        for (const file of localesDirs) {
            const localesFile = require(`../../locales/${file}`);
            for (const language of localesFile.languages) {
                this.locales.set(language, localesFile);
                count++;
            };
        };

        this.log('info', `Loaded ${count} languages`);
    }

    async stop() {
        await this.db.stop();
        await this.destroy();
    };

};

module.exports = Bot;
