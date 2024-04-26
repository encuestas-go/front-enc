/* eslint-disable prettier/prettier */
document.addEventListener("DOMContentLoaded", function() {
    // Obtener el formulario
    let form = document.getElementById("commentForm");
  
    // Agregar un evento de escucha al envío del formulario
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevenir el envío del formulario
        
        let user_id = getCookie('id_user');
        let name = document.getElementById('inputfullname').value;
        let lastname = document.getElementById('inputname').value;
        let day = document.getElementById('inputday').value;
        let month = document.getElementById('inputmonth').value;
        let year = document.getElementById('inputyear').value;
        let date = '' + year + '/' + month + '/' + day;
        let nationality = document.getElementById('nationality').value;
        let sex = document.getElementById('inputsex').value;
        let age = document.getElementById('inputage').value;
        let civilstate = document.getElementById('inputcivil').value;
        let address = document.getElementById('inputaddress').value;
        let rescity = document.getElementById('inputrescity').value;
        let cp = document.getElementById('postalcode').value;
        let entifede = document.getElementById('inputentifede').value;
        let socioeconomico = document.getElementById('inputsocioeconomico').value;
        let education = document.getElementById('inputedu').value;
        let estupadre = document.getElementById('inputestpadre').value;
        let estumadre = document.getElementById('inputestmadre').value;
        let lang = document.getElementById('inputidioma').value;

        encuesta_socioeco_request(user_id, name, lastname, date, nationality, sex, age, civilstate, address, rescity, cp, entifede, socioeconomico, education, estupadre, estumadre, lang)
    });

    function encuesta_socioeco_request(user_id, name, lastname, date, nationality, sex, age, civilstate, address, rescity, cp, entifede, socioeconomico, education, estupadre, estumadre, lang){

        fetch('http://localhost:3000/api/v1/crear/nivelSocioeconomico',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user_id,
                full_name: name,
                last_name: lastname,
                birth_date: date,
                nationality: nationality,
                gender: sex,
                age: age,
                marital_status: civilstate,
                residence_address: address,
                residence_city: rescity,
                postal_code: cp,
                state: entifede,
                socioeconomic_status: socioeconomico,
                language: lang,
                degree_aspired: education,
                last_degree_father: estumadre,
                last_degree_mother: estupadre
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