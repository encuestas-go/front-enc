/* eslint-disable prettier/prettier */
document.addEventListener("DOMContentLoaded", function(){

    /* eslint-disable prettier/prettier */
    // Obtener el enlace por su id
    // eslint-disable-next-line prettier/prettier
    let enlace = document.getElementById("close_session");

    // Definir una condición (puedes cambiar esta condición según tus necesidades)
    let condicion = true;

    // Cambiar el texto del enlace dependiendo de la condición
    if (condicion) {
        enlace.textContent = "Abrir Sesión";
    } else {
        enlace.textContent = "Cerrar Sesión";
    }

});