const { app } = require("@azure/functions");

// Shared in-memory store (per instance)
const games = {};

function generateGameId() {
    return Math.random().toString(36).substring(2, 8);
}

app.http("createGame", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        const gameId = generateGameId();

        games[gameId] = {
            board: Array(6).fill(null).map(() => Array(7).fill(0)),
            players: []
        };

        return {
            status: 200,
            jsonBody: {
                gameId
            }
        };
    }
});

app.http("joinGame", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        const body = await request.json();
        const { gameId } = body;

        if (!gameId || !games[gameId]) {
            return {
                status: 404,
                jsonBody: { error: "Game not found" }
            };
        }

        if (games[gameId].players.length >= 2) {
            return {
                status: 400,
                jsonBody: { error: "Game full" }
            };
        }

        const playerId = "P" + (games[gameId].players.length + 1);
        games[gameId].players.push(playerId);

        return {
            status: 200,
            jsonBody: {
                gameId,
                playerId,
                players: games[gameId].players
            }
        };
    }
});
