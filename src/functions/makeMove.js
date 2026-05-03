const { app } = require("@azure/functions");
const { getGame, updateGame } = require("./store");

// Check win function
function checkWin(board, playerValue) {
    const rows = 6;
    const cols = 7;

    // Horizontal
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 3; c++) {
            if (
                board[r][c] === playerValue &&
                board[r][c + 1] === playerValue &&
                board[r][c + 2] === playerValue &&
                board[r][c + 3] === playerValue
            ) return true;
        }
    }

    // Vertical
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (
                board[r][c] === playerValue &&
                board[r + 1][c] === playerValue &&
                board[r + 2][c] === playerValue &&
                board[r + 3][c] === playerValue
            ) return true;
        }
    }

    // Diagonal \
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < cols - 3; c++) {
            if (
                board[r][c] === playerValue &&
                board[r + 1][c + 1] === playerValue &&
                board[r + 2][c + 2] === playerValue &&
                board[r + 3][c + 3] === playerValue
            ) return true;
        }
    }

    // Diagonal /
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < cols - 3; c++) {
            if (
                board[r][c] === playerValue &&
                board[r - 1][c + 1] === playerValue &&
                board[r - 2][c + 2] === playerValue &&
                board[r - 3][c + 3] === playerValue
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

            // Prevent moves after win
            if (game.winner) {
                return {
                    status: 400,
                    body: JSON.stringify({ error: "Game already finished" })
                };
            }

            // Check turn
            if (game.currentTurn !== playerId) {
                return {
                    status: 400,
                    body: JSON.stringify({ error: "Not your turn" })
                };
            }

            const playerValue = playerId === "P1" ? 1 : 2;

            // Drop piece
            let placed = false;
            for (let row = 5; row >= 0; row--) {
                if (game.board[row][column] === 0) {
                    game.board[row][column] = playerValue;
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

            // Check win
            if (checkWin(game.board, playerValue)) {
                game.winner = playerId;
            } else {
                // Switch turn
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
