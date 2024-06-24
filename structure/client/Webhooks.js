const { WebhookClient } = require('discord.js');

class WebhookManager {
    constructor(bot) {
        this.bot = bot;
    }

    async send(channelId, webhookName, message) {
        const channel = this.bot.channels.cache.get(channelId);
        if (!channel) return;

        const hookData = await this.db.getWebhook(channelId);
        if (!hookData) {

            const webhook = await channel.createWebhook({
                name: webhookName,
                avatar: this.user.avatarURL(options),
                reason: `Webhook ${webhookName} missing for ${channel.name}`,
            });

            await this.db.addWebhook(webhook.id, channel.id, webhookName, webhook.token);

            return await webhook.send(message);

        } else {

            const { id, token } = hookData;
            const webhook = new WebhookClient({ id, token });
            return await webhook.send(message);

        }

    }

};

module.exports = WebhookManager;

