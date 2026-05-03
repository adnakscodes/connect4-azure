const { app } = require("@azure/functions");
const { getGame } = require("./store");

app.http("getGame", {
    methods: ["GET"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        try {
            const gameId = request.query.get("gameId");

            if (!gameId) {
                return {
                    status: 400,
                    body: JSON.stringify({ error: "Missing gameId" })
                };
            }

            const game = await getGame(gameId);

            if (!game) {
                return {
                    status: 404,
                    body: JSON.stringify({ error: "Game not found" })
                };
            }

            return {
                status: 200,
                body: JSON.stringify(game)
            };

        } catch (err) {
            context.log("ERROR getGame:", err);

            return {
                status: 500,
                body: JSON.stringify({ error: err.message })
            };
        }
    }
});
