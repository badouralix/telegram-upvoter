/**
 * @file app/bot.js
 *
 * @description
 * Core file of bot.
 *****************************************************************************/

'use strict';

const logger = require('winston');
const Telegraf = require('telegraf');
const _ = require('lodash');

const bookshelf = require('./model');

const bot = new Telegraf(process.env.BOT_TOKEN)

// Timeit middleware
bot.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const duration = new Date() - start
    logger.info(`Response time ${duration}ms`);
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
    logger.debug(`ctx.chat:          ${JSON.stringify(ctx.chat)}`);
    logger.debug(`ctx.from:          ${JSON.stringify(ctx.from)}`);
    logger.debug(`ctx.match:         ${JSON.stringify(ctx.match)}`);
    logger.debug(`ctx.update:        ${JSON.stringify(ctx.update)}`);
    logger.debug(`ctx.message:       ${JSON.stringify(ctx.message)}`);
    logger.debug(`ctx.editedMessage: ${JSON.stringify(ctx.editedMessage)}`);
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

module.exports = { bot };
