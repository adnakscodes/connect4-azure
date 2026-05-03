const { app } = require("@azure/functions");
const { games } = require("./store");

app.http("joinGame", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        try {
            const body = await request.json();
            const { gameId } = body;

            context.log("Join request:", gameId);

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
