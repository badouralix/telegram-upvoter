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

const { Vote } = require('./model');

const bot = new Telegraf(process.env.BOT_TOKEN, {username: process.env.BOT_USERNAME});

// Timeit middleware
bot.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const duration = new Date() - start
    logger.info(`Response time ${duration}ms`);
});

// Middleware to provide argc and argv
bot.use((ctx, next) => {
    if (ctx.editedMessage) {
        ctx.message = ctx.editedMessage;
    }

    if (ctx.message) {
        ctx.message.argv = _.split(ctx.message.text, /\s/);
        ctx.message.argc = ctx.message.argv.length;
    }

    next();
});

// Debug middleware
bot.use((ctx, next) => {
    logger.debug(`ctx.chat:    ${JSON.stringify(ctx.chat)}`);
    logger.debug(`ctx.from:    ${JSON.stringify(ctx.from)}`);
    logger.debug(`ctx.update:  ${JSON.stringify(ctx.update)}`);
    logger.debug(`ctx.message: ${JSON.stringify(ctx.message)}`);
    next();
});

// Handle /start command
bot.start((ctx) =>
    ctx.reply('This message explains how to use me.')
);

// Handle /upvote command (original and forward)
bot.command('upvote', async (ctx) => {
    const vote = new Vote();
    vote.set('chat_id', ctx.chat.id);
    vote.set('message_id', ctx.message.message_id);
    vote.set('voter_id', ctx.from.id);
    vote.set('votee', ctx.message.argv[1]);

    try {
        const record = await vote.save();
        return ctx.reply(`This is an upvote for ${record.get('votee')}`);
    } catch (err) {
        console.debug('Missing votee detected')
        return ctx.replyWithMarkdown('Usage: _/upvote @username_');
    }
});

/**
 * Handle /results command.
 */
bot.command('results', async (ctx) => {
    const records = await Vote.byChatId( ctx.chat.id );
    const results = _.mapValues( _.groupBy( _.map(records.models, 'attributes'), 'votee' ), 'length');
    const display = JSON.stringify(results);
    return ctx.reply(`Results:\n\t${display}`);
});

// Handle message update
bot.on('edited_message', async (ctx) => {
    if (ctx.message.argv[0].match(`^\/upvote(@${process.env.BOT_USERNAME})?$`)) {
        // Bookshelf doesn't support composite primary key yet
        // See: https://github.com/bookshelf/bookshelf/issues/1664
        await (new Vote()).where({chat_id: ctx.chat.id, message_id: ctx.message.message_id}).save({votee: ctx.message.argv[1]}, {method: 'update', patch: true});
    }
});

// Handle message delete

module.exports = { bot };
