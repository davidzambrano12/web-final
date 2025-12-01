import express from "express";
import mysql from "mysql2";
import cors from "cors";
import path from "path"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"))