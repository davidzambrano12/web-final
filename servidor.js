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


app.post('/',(req, res) =>{
    const objeto = req.body;
    console.log(objeto);
    res.send("recibido");
});

app.post("/registrar", (req, res) =>{
    const { nombre, apellido, telefono, correo, nombre_animal, tipo_animal, especie_animal, edad, vacuna} = req.body;

    const sqlCliente = `
    INSERT INTO clientes (nombre, apellido, telefono, correo)
    VALUES ( ?, ?, ?, ?)
    `
    conexion.query(sqlCliente,[nombre, apellido, telefono, correo], (error, resultadoCliente) => {
        if (error) throw error;
        const id_cliente = resultadoCliente.insertId;

        const sqlAnimal = `
        INSERT INTO animales (id_cliente, nombre_animal, tipo_animal, especie_animal, edad, vacuna)
        VALUES ( ?, ?, ?, ?, ?, ?)
        `;
        conexion.query(sqlAnimal, [id_cliente, nombre_animal, tipo_animal, especie_animal, edad, vacuna], error2 => {
            if (error2) throw error2;

            res.redirect("/lista")
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

app.listen(3080, function(){
    console.log("Servidor corriendo en http://localhost:3080")
})
