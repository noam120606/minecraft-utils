const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const MinecraftRequest = require('../../functions/MinecraftRequest');

class Player {
    constructor(bot, uuid) {
        this.bot = bot;
        this.uuid = uuid;

        this._init = false;

        this.username = null;
        this.skin_bust = null;
        this.skin_all = null;
        this.skin_head = null;
        this.data = null;
    };

    async init() {
        this.username = (await MinecraftRequest(`https://api.mojang.com/user/profile/${this.uuid}`, {}, this.bot))?.name;
        this.skin_bust = `https://mineskin.eu/armor/bust/${this.username}/100.png`;
        this.skin_all = `https://mineskin.eu/skin/${this.username}`;
        this.skin_head = `https://mineskin.eu/avatar/${this.username}`;
        this.data = (await MinecraftRequest(`https://api.minetools.eu/profile/${this.uuid}`, {}, this.bot)).decoded;
    };

    toEmbed(locales) {
        return new EmbedBuilder()
            .setAuthor({ name: this.username, iconURL: this.skin_head })
            .setThumbnail(this.skin_bust)
            .addFields([
                { name: locales.embed.fields.username, value: this.username, inline: true },
                { name: locales.embed.fields.uuid, value: `\`${this.uuid}\``, inline: true },
                
            ])
            .setColor(0x00FF00)
    };
    toComponents(locales, self=false) {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(locales.buttons.ask_friend)
                    .setEmoji('🤍')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(self)
                    .setCustomId(`askfriend_${this.uuid}`),
            );
    };
    toMessage(locales) {
        return {
            embeds: [this.toEmbed(locales)],
            components: [this.toComponents(locales)],
            ephemeral: true,
        };
    };

    getData() {
        return this.data;
    };

    async sendFriendRequest(userId) {
        const id = await this.bot.db.getLinkedAccouts(this.uuid);
        if (!id) return null;

        const reciverLanguage = await this.bot.db.getLanguage(id);
        const reciverLocales = this.bot.locales.get(reciverLanguage) ?? this.bot.locales.get(this.bot.config.default_language);
        const reciverMessages = reciverLocales.components.friend.requests;

        try {
            const user = await this.bot.users.fetch(id);
            this.addPendingRequest(userId);

            const senderPlayer = await this.bot.players.getById(userId)

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`friend_accept_${senderPlayer.uuid}`)
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('✅')
                        .setLabel(reciverMessages.accept),
                    new ButtonBuilder()
                        .setCustomId(`friend_deny_${senderPlayer.uuid}`)
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('❌')
                        .setLabel(reciverMessages.deny),
                    new ButtonBuilder()
                        .setCustomId(`friend_block_${senderPlayer.uuid}`)
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('❌')
                        .setLabel(reciverMessages.block),
                );

            user.send({
                content: reciverMessages.message.replace('{{user}}', `<@${userId}>`),
                components: [row],
            });

        } catch (error) {
            return null;
        }

    };

    addPendingRequest(userId) {

    };

};

module.exports = Player;