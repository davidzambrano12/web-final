const mysql= require("mysql2");
const express=require("express");
const path=require("path");

const app=express();

let conexion = mysql.createConnection({
    host: "localhost",
    database: "vacunacion",
    user: "root",
    password: "1030080",

})

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.render("resgistro");
});


app.post('/validar',(req, res) =>{
    const objeto = req.body;
    console.log(objeto);
    res.send("recibido");
});


app.listen(3080, function(){
    console.log("Servidor corriendo en http://localhost:3080")
})