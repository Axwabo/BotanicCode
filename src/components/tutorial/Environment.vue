<template>
    <h1>Code Environment</h1>
    <p>The code executes in a Web Worker, meaning no access to the window.</p>
    <p>Network requests and imports outside the <code>/bot/</code> and <code>/util/</code> folders are blocked.</p>
    <p>First, await the <code>loadWorld</code> function from <code>sdk/promises.js</code> to load the board.</p>
    <p>Create a bot by calling <code>createBot</code> from <code>sdk/bot.js</code>, give it a name.</p>
    <p>
        Call the bot's <code>move</code> <code>harvest</code> <code>plant</code> functions to interact with the world.
        <br>
        <code>move</code> returns false if the bot collided with a wall.
    </p>
    <p>
        You can wait for the next frame by awaiting <code>nextFrame</code> from the promises file.
        <br>
        It returns the amount of seconds elapsed since the last render.
    </p>
</template>
