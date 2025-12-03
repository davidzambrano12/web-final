import express from "express";
import mysql from "mysql2";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));



const conexion = mysql.createConnection({
    host :"localhost",
    user: "root",
    password:"david",
    database: "veterinaria",
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

app.post("/", (req, res) => {
    const {
        nombre,
        apellido,
        telefono,
        correo,
        nombre_animal,
        tipo_animal,
        especie_animal,
        edad,
        vacuna
    } = req.body;

    // 1. Insertar cliente
    const sqlCliente = `INSERT INTO clientes (nombre, apellido, telefono, correo) VALUES (?, ?, ?, ?)`;

    conexion.query(sqlCliente, [nombre, apellido, telefono, correo], (err, result) => {
        if (err) {
            console.error("Error al insertar cliente:", err);
            return res.status(500).json({ message: "Error al guardar cliente" });
        }

        const id_cliente = result.insertId; // ← OJO AQUÍ

        // 2. Insertar mascota vinculada al cliente
        const sqlAnimal = `
            INSERT INTO animales (id_cliente, nombre_animal, tipo_animal, especie_animal, edad, vacuna)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        conexion.query(sqlAnimal, [id_cliente, nombre_animal, tipo_animal, especie_animal, edad, vacuna], (err2) => {
            if (err2) {
                console.error("Error al insertar animal:", err2);
                return res.status(500).json({ message: "Error al guardar animal" });
            }

            res.json({ message: "Cliente y animal guardados correctamente" });
        });
    });
});


app.get("/lista", (req, res) => {
    const sql = `
        SELECT 
            clientes.nombre,
            clientes.apellido,
            clientes.telefono,
            clientes.correo,
            animales.nombre_animal,
            animales.tipo_animal,
            animales.especie_animal,
            animales.edad,
            animales.vacuna
        FROM animales
        INNER JOIN clientes 
        ON animales.id_cliente = clientes.id_cliente
    `;

    conexion.query(sql, (err, resultados) => {
        if (err) throw err;
        res.render("lista.ejs", { datos: resultados });
    });
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(3000, function(){
    console.log("Servidor corriendo en http://localhost:3000")
})
