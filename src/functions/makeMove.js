const { app } = require("@azure/functions");
const { getGame, updateGame } = require("./store");

function checkWin(board, player) {
    const rows = 6;
    const cols = 7;

    // Horizontal
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c <= cols - 4; c++) {
            if (
                board[r][c] === player &&
                board[r][c + 1] === player &&
                board[r][c + 2] === player &&
                board[r][c + 3] === player
            ) return true;
        }
    }

    // Vertical
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r <= rows - 4; r++) {
            if (
                board[r][c] === player &&
                board[r + 1][c] === player &&
                board[r + 2][c] === player &&
                board[r + 3][c] === player
            ) return true;
        }
    }

    // Diagonal \
    for (let r = 0; r <= rows - 4; r++) {
        for (let c = 0; c <= cols - 4; c++) {
            if (
                board[r][c] === player &&
                board[r + 1][c + 1] === player &&
                board[r + 2][c + 2] === player &&
                board[r + 3][c + 3] === player
            ) return true;
        }
    }

    // Diagonal /
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c <= cols - 4; c++) {
            if (
                board[r][c] === player &&
                board[r - 1][c + 1] === player &&
                board[r - 2][c + 2] === player &&
                board[r - 3][c + 3] === player
            ) return true;
        }
    }

    return false;
}

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

            if (game.winner) {
                return {
                    status: 400,
                    body: JSON.stringify({ error: "Game already finished" })
                };
            }

            if (game.currentTurn !== playerId) {
                return {
                    status: 400,
                    body: JSON.stringify({ error: "Not your turn" })
                };
            }

            const playerValue = playerId === "P1" ? 1 : 2;

            let placedRow = -1;

            // Drop piece
            for (let r = 5; r >= 0; r--) {
                if (game.board[r][column] === 0) {
                    game.board[r][column] = playerValue;
                    placedRow = r;
                    break;
                }
            }

            if (placedRow === -1) {
                return {
                    status: 400,
                    body: JSON.stringify({ error: "Column full" })
                };
            }

            // 🔥 Check win AFTER placing
            if (checkWin(game.board, playerValue)) {
                game.winner = playerId;
            } else {
                game.currentTurn = playerId === "P1" ? "P2" : "P1";
            }

            await updateGame(game);

            return {
                status: 200,
                body: JSON.stringify({
                    board: game.board,
                    currentTurn: game.currentTurn,
                    winner: game.winner || null
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
