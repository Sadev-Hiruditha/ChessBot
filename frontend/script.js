async function analyze() {
    const message = document.getElementById("message").value.trim();
    const responseBox = document.getElementById("response");

    responseBox.textContent = "Thinking...";

    let fen = null;
    if (message.includes("/") && message.split("/").length === 8) {
        fen = message;
    }

    const payload = { message, fen };

    try {
        const res = await fetch("http://127.0.0.1:8000/api/coach", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        // Show ONLY the reply text, formatted nicely
        responseBox.innerHTML = data.reply.replace(/\n/g, "<br>");

    } catch (error) {
        responseBox.textContent = "Connection error: " + error;
    }
}
