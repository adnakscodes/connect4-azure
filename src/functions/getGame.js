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
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ error: "Missing gameId" })
                };
            }

            const game = await getGame(gameId);

            if (!game) {
                return {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ error: "Game not found" })
                };
            }

            // 🔥 DEFAULT FALLBACKS (critical fix)
            const safeGame = {
                id: game.id,
                gameId: game.gameId,
                board: game.board || [],
                players: game.players || [],
                currentTurn: game.currentTurn || "P1",  // 👈 fallback
                winner: game.winner || null
            };

            return {
                status: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(safeGame)
            };

        } catch (err) {
            context.log("ERROR getGame:", err);

            return {
                status: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: err.message })
            };
        }
    }
});const { app } = require("@azure/functions");
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
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ error: "Missing gameId" })
                };
            }

            const game = await getGame(gameId);

            if (!game) {
                return {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ error: "Game not found" })
                };
            }

            // 🔥 DEFAULT FALLBACKS (critical fix)
            const safeGame = {
                id: game.id,
                gameId: game.gameId,
                board: game.board || [],
                players: game.players || [],
                currentTurn: game.currentTurn || "P1",  // 👈 fallback
                winner: game.winner || null
            };

            return {
                status: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(safeGame)
            };

        } catch (err) {
            context.log("ERROR getGame:", err);

            return {
                status: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: err.message })
            };
        }
    }
});
