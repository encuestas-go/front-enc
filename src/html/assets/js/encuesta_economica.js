/* eslint-disable prettier/prettier */
document.addEventListener("DOMContentLoaded", function() {
    // Obtener el formulario
    let form = document.getElementById("commentForm");
  
    // Agregar un evento de escucha al envío del formulario
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevenir el envío del formulario
  
        // Obtener los datos del formulario
        let formData = new FormData(form);
        let allFieldsFilled = true; // Variable para rastrear si todos los campos están llenos
  
        // Verificar si algún campo está vacío
        formData.forEach(function(value, key) {
            if (value.trim() === "") { // Si el valor del campo está vacío después de eliminar espacios en blanco
                allFieldsFilled = false;
                alert("El campo: " + key + " no ha sido completado, por favor completa todos los campos.");
                return; // Salir del bucle forEach tan pronto como se encuentre un campo vacío
            }
        });

        // Obtener los valores de los checkboxes
        let prestacionesValues = [];
        let checkboxes = document.querySelectorAll('.select-input.birth-date-input.form-group input[type="checkbox"]:checked');
        checkboxes.forEach(function(checkbox) {
            let id = checkbox.id;
            let label = checkbox.nextElementSibling.textContent;
            prestacionesValues.push({ id: id, label: label });
        });
  
        // Si todos los campos están llenos, continuar con el envío del formulario
        if (allFieldsFilled) {
            // Construir el mensaje de alerta con los datos del formulario
            let message = "Información Personal:\n";
            formData.forEach(function(value, key) {
                message += key.charAt(0).toUpperCase() + key.slice(1) + ": " + value + "\n";
            });

            // Agregar los valores de los checkboxes al mensaje de alerta
            message += "\nTipos de Prestaciones Seleccionados:\n";
            prestacionesValues.forEach(function(option) {
                message += option.label.trim() + "\n";
            });
  
            // Mostrar la alerta con los datos del formulario
            console.log(message);
            alert(message);
  
            // Redirigir al usuario
            window.location.href = "../../HTML/index.html";
          }
    });
});
