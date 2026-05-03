const { app } = require("@azure/functions");

// In-memory store (temporary for Phase 1)
const games = {};

function generateGameId() {
    return Math.random().toString(36).substring(2, 8);
}

app.http("createGame", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        const gameId = generateGameId();

        // Store empty game
        games[gameId] = {
            board: Array(6).fill(null).map(() => Array(7).fill(0)),
            players: []
        };

        return {
            status: 200,
            jsonBody: {
                gameId: gameId
            }
        };
    }
});
