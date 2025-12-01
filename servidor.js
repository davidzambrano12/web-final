import express from "express";
import mysql from "mysql2";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const conexion = mysql.createConnection({
    host :"localhost",
    user: "root",
    password:"david",
    database: "vacunacion",
});

conexion.connect(error =>{
    if (error) {
        console.error("error al conectar con mysql", error);
        process.exit(1);
    }
    console.log("conectado a mysql")
});

app.get("/", (req, res)=>{
    res.render("pagina");
});


app.post('/',(req, res) =>{
    const objeto = req.body;
    console.log(objeto);
    res.send("recibido");
});


app.listen(3080, function(){
    console.log("Servidor corriendo en http://localhost:3080")
})
