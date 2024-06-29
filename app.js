const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const postRoutes = require("./routes/postRoutes");

const app = express();

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the styles.css file directly
app.get("/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "styles.css"));
});

app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/posts", postRoutes);

// Serve HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "community.html"));
});

app.get("/community", (req, res) => {
  res.sendFile(path.join(__dirname, "community-page.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
