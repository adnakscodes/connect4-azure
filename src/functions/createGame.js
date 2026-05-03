const { app } = require("@azure/functions");
const { games } = require("./store");

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
