const https = require("https");
const fs = require("fs");
const express = require("express"); // Assuming you're using Express

const app = express();

// Serve your app routes
app.get("/", (req, res) => {
  res.send("Hello HTTPS!");
});

// Read the key and certificate files
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

// Create the HTTPS server
https.createServer(options, app).listen(3001, () => {
  console.log("HTTPS server running on https://localhost:3001");
});

// TEsting 1
