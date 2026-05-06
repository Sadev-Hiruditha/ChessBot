const board = document.getElementById("board");
const game = new Chess();

// Start the invisible referee
game.load('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

// A "flag" to tell our code when to step in
let needsSpecialSync = false;

// 1. Block illegal grabs
board.addEventListener('drag-start', (e) => {
    const piece = e.detail.piece; 
    if ((game.turn() === 'w' && piece.startsWith('b')) || 
        (game.turn() === 'b' && piece.startsWith('w'))) {
        e.preventDefault(); 
    }
});

// 2. Handle the drop
board.addEventListener('drop', (e) => {
    const { source, target, setAction } = e.detail;

    // Ask the referee if the move is legal
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q' 
    });

    if (!move) {
        setAction('snapback');
    } else {
        document.getElementById("response").innerHTML = "";
        
        console.log(`Move played. Flags: ${move.flags}`);

        // THE SNIPER FIX: 
        // Only trigger a board sync if it's Castling ('k', 'q'), En Passant ('e'), or Promotion ('p')
        if (move.flags.includes('k') || move.flags.includes('q') || 
            move.flags.includes('e') || move.flags.includes('p')) {
            needsSpecialSync = true;
            console.log("Special move detected! Board sync prepared.");
        }
    }
});

// 3. Sync the board ONLY if a special move happened
board.addEventListener('snap-end', () => {
    if (needsSpecialSync) {
        const currentFen = game.fen();
        console.log("Executing special board sync: ", currentFen);
        
        // Use setAttribute (the safest way to update web components)
        board.setAttribute('position', currentFen);
        
        // Reset the flag for the next move
        needsSpecialSync = false; 
    }
});

// 4. Analyze button logic
async function analyze() {
    const message = document.getElementById("message").value.trim();
    const responseBox = document.getElementById("response");

    responseBox.innerHTML = "Thinking...";

    if (game.load(message)) {
        board.setAttribute('position', game.fen()); 
    }

    const fen = game.fen();
    const payload = { message, fen };

    try {
        const res = await fetch("http://127.0.0.1:8000/api/coach", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok || !data.reply) {
            throw new Error(data.detail || "The server failed to generate a response.");
        }

        let html = marked.parse(data.reply);
        responseBox.innerHTML = html;

    } catch (error) {
        responseBox.textContent = "Error: " + error.message;
    }
}