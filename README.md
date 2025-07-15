# Botanic Code

A browser game (PWA) where you have to program bots to maintain a farm.

Create bots that feed animals, harvest and plant crops, and more coming soon!

## Gameplay

When first visiting the site, a tutorial will guide you through the basics.
You can restart the tutorial in settings (bottom left).

The code runs in a web worker, meaning it has no access to the main event loop, nor any window objects.

Tick the `Show SDK` box to view files usable by the worker. Use these files to create your bot.
Since the game uses a mock file system, `/BotanicCode/bot/` is accessible from `/bot/`

Wait for the world to load, then create your bots.

Harvest the tile the bot is on to get items (`bot.harvest`).

Plant the seeds or fruits (`bot.plant`), and drop items (`bot.plant`) that animals can eat:

- chicken: any seed
- pig: carrot, potato, wheat
- cow & sheep: wheat

> [!NOTE]
> Chickens may pick seeds from the grass if they can't find wheat nearby.
> Cows and sheep are ruminant (eat grass), but prefer dropped wheat.

Don't let your bots run out of energy! Go to the charging station every once in a while to recharge.

Use magic on a tile or entity if the bot is near (`bot.magic`):

- Tile: makes the plant fully grown
- Entity:
  - Restores the entity's energy to maximum
  - Creates a clone of the entity with low energy

# Running Locally

1. Clone the repository
2. cd into the directory `BotanicCode`
3. Execute `pnpm run dev`
