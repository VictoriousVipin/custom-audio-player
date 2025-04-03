const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html as the root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
