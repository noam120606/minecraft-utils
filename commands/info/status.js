const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const BaseCommand = require("../../structure/components/BaseCommand");
const { SlashCommandOptionsType } = require("../../structure/utils/Types");

const commandOpt = {
    name: "status",
    options: [
        {
            name: "ip",
            type: SlashCommandOptionsType.STRING,
            required: true,
        },
    ],
};

class Command extends BaseCommand {
    constructor(bot) { super(bot, commandOpt); };

    async run(interaction) {

        const messages = interaction.locales.user.messages.status;

        const ip = interaction.options.getString("ip");
        const server = await this.bot.mc.servers.get(ip);

        const Embed = new EmbedBuilder()
        .setTitle(messages.embed.title.replace("{{ip}}", ip))
        .setColor(server.online ? 0x00FF00 : 0xFF0000)
        .setThumbnail(server.image.url)
        .setDescription(server.online ? [
            messages.embed.description.ip.replace("{{connect}}", server.connect),
            messages.embed.description.players.replace("{{players}}", server.players.string),
            messages.embed.description.types[server.isBedrock ? "bedrock" : "java"],
            messages.embed.description.version.replace(`{{version}}`, server.version),
        ].join('\n') : messages.embed.description.offline);

        const listButton = new ButtonBuilder()
            .setCustomId(`playerlist_${ip}`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('👥')
            .setLabel(messages.buttons.playerlist.label);
        const row = new ActionRowBuilder().addComponents(listButton);

        interaction.reply({ embeds: [Embed], ephemeral: true, components: [row] });
    };

};

module.exports = Command;