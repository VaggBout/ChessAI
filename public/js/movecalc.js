
var evaluateBoard = function(board, color) {
    // Sets a value for each piece. Check https://en.wikipedia.org/wiki/Chess_piece_relative_value. Different values from link so we wont deal with floating numbers.
    var pieceValue = {
        'p': 100,
        'n': 350,
        'b': 350,
        'r': 525,
        'q': 1000,
        'k': 10000
    };

    // sum up total value of pieces
    var value = 0;
    board.forEach(function(row) {
        row.forEach(function(piece) {
            if (piece) {
                // Subtract piece value if it is opponent's piece
                value += pieceValue[piece['type']]
                    * (piece['color'] === color ? 1 : -1);
            }
        });
    });

    return value;
};

//Calc move with Min Max and Alpha Beta Pruning.
var calcBestMove = function(depth, game, playerColor,
                            alpha=Number.NEGATIVE_INFINITY,
                            beta=Number.POSITIVE_INFINITY,
                            isMaximizingPlayer=true) {
    // Base case: evaluate board
    if (depth === 0) {
        value = evaluateBoard(game.board(), playerColor);
        return [value, null]
    }

    // search possible moves
    var bestMove = null;
    var possibleMoves = game.moves();
    // Set random order for possible moves
    possibleMoves.sort(function(a, b){return 0.5 - Math.random()});
    // Set a default best move value
    var bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY
        : Number.POSITIVE_INFINITY;
    // Search through all possible moves
    for (var i = 0; i < possibleMoves.length; i++) {
        var move = possibleMoves[i];
        // Make the move, but undo before exiting loop
        game.move(move);
        // Recursively get the value from this move
        value = calcBestMove(depth-1, game, playerColor, alpha, beta, !isMaximizingPlayer)[0];
        // Log the value of this move
        console.log(isMaximizingPlayer ? 'Max: ' : 'Min: ', depth, move, value,
            bestMove, bestMoveValue);

        if (isMaximizingPlayer) {
            // Look for moves that maximize position
            if (value > bestMoveValue) {
                bestMoveValue = value;
                bestMove = move;
            }
            alpha = Math.max(alpha, value);
        } else {
            // Look for moves that minimize position
            if (value < bestMoveValue) {
                bestMoveValue = value;
                bestMove = move;
            }
            beta = Math.min(beta, value);
        }
        // Undo previous move
        game.undo();
        // Check for alpha beta pruning
        if (beta <= alpha) {
            console.log('Prune', alpha, beta);
            break;
        }
    }
    // Log the best move at the current depth
    console.log('Depth: ' + depth + ' | Best Move: ' + bestMove + ' | ' + bestMoveValue + ' | A: ' + alpha + ' | B: ' + beta);
    // Return the best move, or the only move
    return [bestMoveValue, bestMove || possibleMoves[0]];
};