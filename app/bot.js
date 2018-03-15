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

// Middleware to provide argc and argv
bot.use((ctx, next) => {
    if (ctx.message) {
        ctx.param = new Object({
            argv: _.split(ctx.message.text, /\s/),
        });
    }
    else if (ctx.editedMessage) {
        ctx.param = new Object({
            argv: _.split(ctx.editedMessage.text, /\s/),
        });
    }

    // Only follow up on commands
    if (ctx.param.argv[0].match(/^\//)) {
        ctx.param.argc = ctx.param.argv.length;
        next();
    }
});

// Timeit middleware
bot.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const duration = new Date() - start
    logger.info(`Response time ${duration}ms`);
});

// Debug middleware
bot.use((ctx, next) => {
    logger.debug(`ctx.chat:    ${JSON.stringify(ctx.chat)}`);
    logger.debug(`ctx.from:    ${JSON.stringify(ctx.from)}`);
    logger.debug(`ctx.param:   ${JSON.stringify(ctx.param)}`);
    logger.debug(`ctx.update:  ${JSON.stringify(ctx.update)}`);
    next();
});

// Handle /start command
bot.start((ctx) =>
    ctx.reply('Add me to a Telegram group.')
);

// Handle /upvote command (original and forward)
bot.command('upvote', async (ctx) => {
    // Check parameters
    if (ctx.param.argc !== 2 || ! ctx.param.argv[1].match(/^@?\w+$/)) {
        console.debug('Invalid parameters detected');
        return ctx.replyWithMarkdown('Usage: _/upvote @username_');
    }

    const vote = new Vote();
    vote.set('chat_id', ctx.chat.id);
    vote.set('message_id', ctx.message.message_id);
    vote.set('voter_id', ctx.from.id);
    vote.set('votee', ctx.param.argv[1].replace(/^@?(\w+)$/, '$1'));

    try {
        const record = await vote.save();
        return ctx.reply(`This is an upvote for ${record.get('votee')}`);
    } catch (err) {
        console.debug(err);
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
    if (ctx.param.argc === 2
            && ctx.param.argv[0].match(`^\/upvote(@${process.env.BOT_USERNAME})?$`)
            && ctx.param.argv[1].match(/^@?\w+$/))
    {
        // Bookshelf doesn't support composite primary key yet
        // See: https://github.com/bookshelf/bookshelf/issues/1664
        await (new Vote()).where({chat_id: ctx.chat.id, message_id: ctx.editedMessage.message_id})
                          .save({votee: ctx.param.argv[1].replace(/^@?(\w+)$/, '$1')}, {method: 'update', patch: true});
    }
});

// Handle message delete

module.exports = { bot };
