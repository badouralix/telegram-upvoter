const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log('Response time %sms', ms)
})

bot.start((ctx) => {
    console.log('started:', ctx.from.id)
    return ctx.reply('Welcome!')
})

bot.command('upvote', (ctx) => {
    console.log(ctx);
    ctx.reply('This is an upvote');
});

console.log('Starting bot now');
bot.startPolling();
