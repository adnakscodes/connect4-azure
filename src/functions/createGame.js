const { app } = require("@azure/functions");
const { createGame } = require("./store");

function generateGameId() {
    return Math.random().toString(36).substring(2, 8);
}

app.http("createGame", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        try {
            const gameId = generateGameId();

            const game = {
                id: gameId,
                gameId: gameId,
                board: Array(6).fill(null).map(() => Array(7).fill(0)),
                players: ["P1"],
                currentTurn: "P1",
                winner: null
            };

            await createGame(game);

            return {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    gameId,
                    playerId: "P1"
                })
            };
        } catch (err) {
            context.log("ERROR createGame:", err);

            return {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ error: err.message })
            };
        }
    }
});
