const { app } = require("@azure/functions");

// Shared in-memory store
const games = {};

function generateGameId() {
    return Math.random().toString(36).substring(2, 8);
}

// CREATE GAME
app.http("createGame", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        const gameId = generateGameId();

        games[gameId] = {
            board: Array(6).fill(null).map(() => Array(7).fill(0)),
            players: []
        };

        context.log("Game created:", gameId);

        return {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ gameId })
        };
    }
});

// JOIN GAME
app.http("joinGame", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        try {
            const body = await request.json();
            const { gameId } = body;

            context.log("Join request for:", gameId);

            if (!gameId || !games[gameId]) {
                return {
                    status: 404,
                    body: JSON.stringify({ error: "Game not found" })
                };
            }

            if (games[gameId].players.length >= 2) {
                return {
                    status: 400,
                    body: JSON.stringify({ error: "Game full" })
                };
            }

            const playerId = "P" + (games[gameId].players.length + 1);
            games[gameId].players.push(playerId);

            return {
                status: 200,
                body: JSON.stringify({
                    gameId,
                    playerId,
                    players: games[gameId].players
                })
            };
        } catch (err) {
            context.log("ERROR:", err);

            return {
                status: 500,
                body: JSON.stringify({ error: "Internal error" })
            };
        }
    }
});
