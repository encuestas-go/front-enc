/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
document.addEventListener("DOMContentLoaded", function() {
  // Obtener el formulario
  let form = document.getElementById("commentForm1");
  
  // Agregar un evento de escucha al envío del formulario
  form.addEventListener("submit", function(event) {
      event.preventDefault(); // Prevenir el envío del formulario
  
      // Obtener los datos del formulario
      let formData = new FormData(form);
  
      // Construir el mensaje de alerta con los datos del formulario
      let message = "Información Personal:\n";
      formData.forEach(function(value, key) {
          message += key.charAt(0).toUpperCase() + key.slice(1) + ": " + value + "\n";
      });
      

      // Mostrar la alerta con los datos del formulario
      console.log(message);

      window.location.href = "../../HTML/index.html";
  });
});

