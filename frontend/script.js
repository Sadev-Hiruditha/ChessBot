const board = document.getElementById("board");
const game = new Chess();

// Handle moves from the board
board.addEventListener("move", (e) => {
    const move = game.move({
        from: e.detail.from,
        to: e.detail.to,
        promotion: "q" // Always promote to a queen for simplicity
    });

    if (!move) {
        board.fen = game.fen(); // illegal → snap back
    }
});

// Analyze button
async function analyze() {
    const message = document.getElementById("message").value.trim();
    const responseBox = document.getElementById("response");

    responseBox.innerHTML = "Thinking...";

    const fen = game.fen();
    const payload = { message, fen };

    try {
        const res = await fetch("http://127.0.0.1:8000/api/coach", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        // Enhanced basic markdown parser
        let html = data.reply
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
            .replace(/### (.*?)(\n|$)/g, "<h3>$1</h3>") // H3 Headers
            .replace(/(?:^|\n)[*-]\s+(.*)/g, "<ul><li>$1</li></ul>") // Bullet points
            .replace(/<\/ul>\n<ul>/g, "") // Merge adjacent lists
            .replace(/\n\n/g, "<br><br>") // Double line breaks
            .replace(/\n/g, "<br>"); // Single line breaks

        responseBox.innerHTML = html;

    } catch (error) {
        responseBox.textContent = "Connection error: " + error.message;
    }
}