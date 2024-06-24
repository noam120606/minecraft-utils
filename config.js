module.exports = {
    ownersIds: ["457926967661035522"],
    default_language: "fr",
    agent: "Minecraft-Utils (indev)",
    linked: {
        loginURL: `${process.env.HOSTNAME}/login`,
        logoutURL: `${process.env.HOSTNAME}/logout`,
    },
    apis: {
        serverInfo: {
            baseUrl: 'https://api.mcsrvstat.us',
            version: 3,
        },
        serverAvatar: {
            baseUrl: 'https://api.mcsrvstat.us/icon/',
        },
        mcAuth: {
            authorize: 'https://mc-auth.com/oAuth2/authorize',
            token: 'https://mc-auth.com/oAuth2/token',
            id: process.env.MC_AUTH_ID,
            secret: process.env.MC_AUTH_SECRET,
            redirect_uri: `${process.env.HOSTNAME}/callback/mc`,
        },
        discordAuth: {
            authorize: 'https://discord.com/oauth2/authorize',
            token: 'https://discord.com/api/oauth2/token',
            id: process.env.DISCORD_ID,
            secret: process.env.DISCORD_SECRET,
            redirect_uri: `${process.env.HOSTNAME}/callback/dsc`,
        },
    },
}