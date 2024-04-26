/* eslint-disable prettier/prettier */
document.addEventListener("DOMContentLoaded", function() {
    // Obtener el formulario
    let form = document.getElementById("commentForm");
  
    // Agregar un evento de escucha al envío del formulario
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevenir el envío del formulario
  
            let user_id = getCookie('id_user');
            let job_situation = document.getElementById('jobsituation').value;
            let job = document.getElementById('job').value;
            let place_job = document.getElementById('placejob').value;
            let type_job = document.getElementById('typejob').value;
            let salary = document.getElementById('salary').value;
            let type_salary = document.getElementById('typesalary').value;
            let work_benefits = [];

            // Selecciona todos los checkboxes por su clase
            let checkboxes = document.querySelectorAll('.form-check-input');
            
            // Itera sobre cada checkbox
            checkboxes.forEach(function(checkbox) {
                // Verifica si está marcado
                if (checkbox.checked) {
                    // Si está marcado, agrega su valor a la lista
                    work_benefits.push(checkbox.value);
                }
            });

            console.log(user_id, job_situation, job, place_job, type_job, salary, type_salary, work_benefits);
            //encuesta_eco_request(user_id, job_situation, job, place_job, type_job, salary, type_salary, work_benefits.value)

          });

          function encuesta_eco_request(user_id, job_situation, job, place_job, type_job, salary, type_salary, work_benefits){

            fetch('http://localhost:3000/api/v1/crear/nivelEconomico',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_user: user_id,
                current_status: job_situation,
                job_title: job,
                employer_establishment: place_job,
                employment_type: type_job,
                salary: salary,
                amount_type: type_salary,
                work_benefits_type: work_benefits
            })
        })
        .then(response => response.json()) 
        .then(data => {
            console.log(data);
            if (data.status_code && data.status_code != 201) {
                alert('No se lleno la encuesta correctamente');
                return;
            }
            window.location.href = 'complete.html';
        }) 
        .catch(error => {
            console.error('Error:', error);
            // TODO: change to modal
            alert('Error al crear la encuesta');
        }); 
    }
});