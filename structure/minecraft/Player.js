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
    }

    toEmbed(locales) {
        return new EmbedBuilder()
            .setAuthor({ name: this.username, iconURL: this.skin_head })
            .setThumbnail(this.skin_bust)
            .addFields([
                { name: 'Username', value: this.username, inline: true },
                { name: 'UUID', value: `\`${this.uuid}\``, inline: true },
                
            ])
            .setColor(0x00FF00)
            //.setImage(mc_skin_all);
    }
    toComponents(locales, self=false) {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Ask friend')
                    .setEmoji('🤍')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(self)
                    .setCustomId(`friend_${this.uuid}`),
            );
    }
    toMessage(locales) {
        return {
            embeds: [this.toEmbed(locales)],
            components: [this.toComponents(locales)],
            ephemeral: true,
        };
    }

    getData() {
        return this.data;
    }   
}

module.exports = Player;