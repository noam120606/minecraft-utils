module.exports = async (endpoint, options, bot=undefined) => {

    const url = 'https://discord.com/api/v10/' + endpoint
    if (options.body) options.body = JSON.stringify(options.body);
    const res = await fetch(url, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'User-Agent': bot.config.agent,
        },
        ...options,
    });

    if (!res.ok) {
        const data = await res.json();
        log('error', JSON.stringify(data));
    }

    if (bot) bot.log('info', `Request completed ${endpoint}`);

    return res;
}