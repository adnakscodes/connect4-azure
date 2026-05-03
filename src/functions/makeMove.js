const { app } = require("@azure/functions");
const { getGame, updateGame } = require("./store");

app.http("makeMove", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        try {
            const body = await request.json();
            const { gameId, column, playerId } = body;

            const game = await getGame(gameId);

            if (!game) {
                return {
                    status: 404,
                    body: JSON.stringify({ error: "Game not found" })
                };
            }

            // Check turn
            if (game.currentTurn !== playerId) {
                return {
                    status: 400,
                    body: JSON.stringify({ error: "Not your turn" })
                };
            }

            // Drop piece (bottom-up)
            let placed = false;
            for (let row = 5; row >= 0; row--) {
                if (game.board[row][column] === 0) {
                    game.board[row][column] = playerId === "P1" ? 1 : 2;
                    placed = true;
                    break;
                }
            }

            if (!placed) {
                return {
                    status: 400,
                    body: JSON.stringify({ error: "Column full" })
                };
            }

            // Switch turn
            game.currentTurn = playerId === "P1" ? "P2" : "P1";

            await updateGame(game);

            return {
                status: 200,
                body: JSON.stringify({
                    board: game.board,
                    currentTurn: game.currentTurn
                })
            };

        } catch (err) {
            context.log("ERROR makeMove:", err);

            return {
                status: 500,
                body: JSON.stringify({ error: err.message })
            };
        }
    }
});
