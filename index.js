require('dotenv').config();
const { IntentsBitField } = require('discord.js');

const Bot = require('./structure/client/Bot');
const { DISCORD_TOKEN, DISCORD_INTENTS, DISCORD_ID, LOG_WEBHOOK, PORT, SESSION_SECRET } = process.env;
const bot = new Bot({ token: DISCORD_TOKEN, intents: new IntentsBitField(DISCORD_INTENTS), id: DISCORD_ID, logURL: LOG_WEBHOOK, port: PORT, session_secret: SESSION_SECRET });

bot.start();
