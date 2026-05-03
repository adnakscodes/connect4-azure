const { app } = require("@azure/functions");
const { getGame, updateGame } = require("./store");

app.http("joinGame", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        const body = await request.json();
        const { gameId } = body;

        const game = await getGame(gameId);

        if (!game) {
            return {
                status: 404,
                body: JSON.stringify({ error: "Game not found" })
            };
        }

        if (game.players.length >= 2) {
            return {
                status: 400,
                body: JSON.stringify({ error: "Game full" })
            };
        }

        const playerId = "P" + (game.players.length + 1);
        game.players.push(playerId);

        await updateGame(game);

        return {
            status: 200,
            body: JSON.stringify({
                gameId,
                playerId,
                players: game.players
            })
        };
    }
});
