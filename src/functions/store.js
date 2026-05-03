const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);

const database = client.database(process.env.COSMOS_DB_DATABASE);
const container = database.container(process.env.COSMOS_DB_CONTAINER);

// CREATE GAME
async function createGame(game) {
    await container.items.create(game);
    return game;
}

// GET GAME
async function getGame(gameId) {
    try {
        const { resource } = await container.item(gameId, gameId).read();
        return resource;
    } catch {
        return null;
    }
}

// UPDATE GAME
async function updateGame(game) {
    await container.items.upsert(game);
    return game;
}

module.exports = {
    createGame,
    getGame,
    updateGame
};
