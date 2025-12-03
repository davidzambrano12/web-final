document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;

  // OBJETO CORREGIDO SEGÚN LOS NAME="" DEL FORMULARIO
  const objeto = {
    nombre: form.nombre.value,
    apellido: form.apellido.value,
    telefono: form.telefono.value,
    correo: form.correo.value,

    nombre_animal: form.nombre_animal.value,
    tipo_animal: form.tipo.value,             // name="tipo" en el select
    especie_animal: form.especie.value,       // name="especie"
    edad: form.edad.value,
    vacuna: form.vacuna.value
  };

  console.log("Enviado al servidor:", objeto);

  try {
    const res = await fetch("http://localhost:3000", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(objeto)
    });

    const data = await res.json();
    console.log("Respuesta del servidor:", data);

    await Swal.fire({
      title: "Registro exitoso",
      text: data.message || "Registro completado",
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Aceptar"
    });

    form.reset();

  } catch (error) {
    console.error("Error al enviar:", error);

    Swal.fire({
      title: "Error",
      text: "No se pudo registrar",
      icon: "error",
      confirmButtonColor: "#d33",
      confirmButtonText: "Intentar de nuevo"
    });
  }
});
