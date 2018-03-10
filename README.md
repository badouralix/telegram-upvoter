# telegram-upvoter

A Telegram bot to upvote about anything

## Usage

### Create a Telegram bot

Request a new bot token to [BotFather](https://telegram.me/botfather).
Then copy-paste the given token to [token.env](token.env.dist).

### Run in dev mode

To run the bot in development mode, run the following:

```bash
docker-compose up
```

### Cleaning

Delete containers, networks, images and volumes:

```bash
docker-compose down --rmi local --volumes
```
