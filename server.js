import express from "express";
import { fileURLToPath } from 'url';
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "home.html"));
});

app.get("/services", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "services.html"));
});

app.get("/location", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "location.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "admin.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "login.html"));
});

app.listen(5001);