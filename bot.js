const Telegraf = require('telegraf');
const _ = require('lodash');

const bot = new Telegraf(process.env.BOT_TOKEN)

// Timeit middleware
bot.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log('Response time %sms', ms)
});

// Middleware to provide argc and argv
// TODO: remove @botname from argv[0] string
bot.use((ctx, next) => {
    if (ctx.message) {
        ctx.message.argv = _.split(ctx.message.text, ' ');
        ctx.message.argc = ctx.message.argv.length;
    }

    if (ctx.editedMessage) {
        ctx.editedMessage.argv = _.split(ctx.editedMessage.text, ' ');
        ctx.editedMessage.argc = ctx.editedMessage.argv.length;
    }

    next();
});

// Debug middleware
bot.use((ctx, next) => {
    console.log(`ctx.chat:          ${JSON.stringify(ctx.chat)}`);
    console.log(`ctx.from:          ${JSON.stringify(ctx.from)}`);
    console.log(`ctx.match:         ${JSON.stringify(ctx.match)}`);
    console.log(`ctx.update:        ${JSON.stringify(ctx.update)}`);
    console.log(`ctx.message:       ${JSON.stringify(ctx.message)}`);
    console.log(`ctx.editedMessage: ${JSON.stringify(ctx.editedMessage)}`);
    next();
});

// Handle /start command
bot.start((ctx) =>
    ctx.reply('This message explains how to use me.')
);

// Handle /upvote command (original and forward)
bot.command('upvote', (ctx) => {
    return ctx.reply(`This is an upvote for ${ctx.message.argv[1]}`);
});

// Handle message update
bot.on('edited_message', (ctx) => {
    return ctx.reply('Message edited');
});

// Handle message delete

// Start bot
console.log('Starting bot now');
bot.startPolling();
