module.exports = async (url, options, bot=undefined) => {

    if (options.body) options.body = JSON.stringify(options.body);

    const res = await fetch(url, options);

    if (res.error) {
        const data = await res.json();
        log('error', JSON.stringify(data));
    }

    if (bot) bot.log('info', `Request completed ${url}`);

    return await res.json();
}