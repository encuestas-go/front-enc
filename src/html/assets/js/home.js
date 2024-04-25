/* eslint-disable prettier/prettier */
   // Simulamos que el usuario ha iniciado sesión
   var usuarioLogueado = false;
   // Función para verificar si el usuario ha iniciado sesión
   function verificarSesion() {
       if (!usuarioLogueado) {
           // Redireccionar a la página de inicio de sesión si no ha iniciado sesión
           document.getElementById("close_session").addEventListener("click", function(event) {
               event.preventDefault(); // Evita la acción predeterminada del enlace
               window.location.href = "../Anfra_v2.1_main/login-register-1/index.html"; // Redirecciona al usuario a la página de inicio de sesión
           });
       }else{
           window.location.href = "../HTML/index.html"; 
       }
       usuarioLogueado = true;
   }
   // Verificar la sesión al cargar la página
   window.onload = function() {
       verificarSesion();
   };


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