var existData = false;
hideDeleteButton();

document.addEventListener("DOMContentLoaded", function() {
    checkValidHour();

    fetchSurveyData();
    document.getElementById("button-delete").addEventListener("click", function(event) {
        event.preventDefault();
        deleteSatisSurvey();
    });
    
    document.getElementById("commentForm").addEventListener("submit", function(event) {
        event.preventDefault();

        if (!existData) {
            createNewSatisSurvey();
        } else {
            updateSatisSurvey();
        }
    })
});


function createNewSatisSurvey() {
    let url = new URL('http://localhost:3000/api/v1/crear/encuestaLikert');
    let survey = getSatisSurvey();
    
    if (!areAllValuesValid(survey)) {
        alert('Llena todos los valor en la encuesta');
        return;
    }

    fetch(url, {
        method: 'POST', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(survey),
        credentials: 'include' 
    })
    .then(response => {
        if (response.ok) {
            return response.json(); 
        } else {
            throw new Error('Failed to create data'); 
        }
    })
    .then(data => {
        if (data.status_code && data.status_code != 201) {
            alert('Error al crear la  encuesta');
            setTimeout(() => {}, 2000); 
            return;
        }

        alert('Encuesta creada con éxito');
        setTimeout(() => {}, 3000); 
        location.reload(true); 
    })
    .catch(error => {
        alert('Error al crear encuesta');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}

function getSatisSurvey() {
    return{
        "id_user": convertToInteger( getCookie('id_user') ),
        "facilidad_uso": convertToInteger( getHTMLValue('preg1') ),
        "claridad_instruccion": convertToInteger( getHTMLValue('preg2') ),
        "relevancia_contenido": convertToInteger( getHTMLValue('preg3') ),
        "rapidez_carga": convertToInteger( getHTMLValue('preg4') ),
        "satisfaccion_general": convertToInteger( getHTMLValue('preg5') ),
    }
}

function fetchSurveyData() {
    let url = new URL('http://localhost:3000/api/v1/consultar/encuestaSatisfaccion');
    url.searchParams.append('user_id', getCookie('id_user'));

    fetch(url, {
        method: 'GET', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
        },
        credentials: 'include' 
    })
    .then(response => {
        if (response.ok) {
            return response.json(); 
        } else {
            throw new Error('Failed to fetch data'); 
        }
    })
    .then(data => {
        if (data.status_code && data.status_code != 200) {
            alert('Error al obtener la informacion de la encuesta');
            setTimeout(() => {}, 2000); 
            return;
        }

        if (data.data && data.data.length == 0) {
            existData = false;
            return;
        }

        existData = true;
        changeButtonContent();
        showDeleteButton();

        const user = data.data[0];
        const userDetails = {
            id: user.id,
            facilidad_uso: user.facilidad_uso,
            claridad_instruccion: user.claridad_instruccion,
            relevancia_contenido: user.relevancia_contenido,
            rapidez_carga: user.rapidez_carga,
            satisfaccion_general: user.satisfaccion_general,
            id_user: user.id_user
        };
        
        fillSurveyFormIfExist(userDetails);
    })
    .catch(error => {
        alert('Error al obtener la informacion de la encuesta');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}

function fillSurveyFormIfExist(userDetails) {
        document.getElementById('preg1').value = userDetails.facilidad_uso;
        document.getElementById('preg2').value = userDetails.claridad_instruccion;
        document.getElementById('preg3').value = userDetails.relevancia_contenido;
        document.getElementById('preg4').value = userDetails.rapidez_carga;
        document.getElementById('preg5').value = userDetails.satisfaccion_general;    
}

function updateSatisSurvey() {
    let url = new URL('http://localhost:3000/api/v1/actualizar/encuestaSatisfaccion');
    let survey = getSatisSurvey();
    
    if (!areAllValuesValid(survey)) {
        alert('Llena todos los valor en la encuesta');
        return;
    }

    fetch(url, {
        method: 'PUT', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(survey),
        credentials: 'include' 
    })
    .then(response => {
        if (response.ok) {
            return response.json(); 
        } else {
            throw new Error('Failed to create data'); 
        }
    })
    .then(data => {
        if (data.status_code && data.status_code != 200) {
            alert('Error al actualizar la encuesta');
            setTimeout(() => {}, 2000); 
            return;
        }

        alert('actualizado con exito');
        setTimeout(() => {}, 3000); 
        location.reload(true); 
    })
    .catch(error => {
        alert('Error al actualizar encuesta');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}

function deleteSatisSurvey() {
    let url = new URL('http://localhost:3000/api/v1/eliminar/encuestaSatisfaccion');
    url.searchParams.append('user_id', getCookie('id_user'));
    
    fetch(url, {
        method: 'DELETE', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
        },
        credentials: 'include' 
    })
    .then(response => {
        if (response.ok) {
            return response.json(); 
        } else {
            throw new Error('Failed to create data'); 
        }
    })
    .then(data => {
        if (data.status_code && data.status_code != 200) {
            alert('Error al eliminar la encuesta');
            setTimeout(() => {}, 2000); 
            return;
        }

        alert('Eliminado con exito');
        setTimeout(() => {}, 3000); 
        location.reload(true); 
    })
    .catch(error => {
        alert('Error al eliminar encuesta');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}

function checkValidHour() {
    let url = new URL('http://localhost:3000/api/v1/consultar/encuestaHorario');
    url.searchParams.append('user_id', getCookie('id_user'));

    fetch(url, {
        method: 'GET', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
        },
        credentials: 'include' 
    })
    .then(response => {
        if (response.ok) {
            return response.json(); 
        } else {
            throw new Error('Failed to fetch data'); 
        }
    })
    .then(data => {
        if (data.status_code && data.status_code != 200) {
            alert('Error al obtener la informacion de la encuesta');
            setTimeout(() => {}, 2000); 
            return;
        }

        if (!data.data || data.data.length == 0) {
            alert('No se ha programado una encuesta');
            setTimeout(() => { window.location.href = "account-category.html"; }, 1000); 
            return;
        }

        existData = true;
        changeButtonContent();
        showDeleteButton();

        const user = data.data;
        const userDetails = {
            id: user.id,
            iduser: user.id_user,
            schedule: user.scheduled_date
        };
        
        const currentDateTime = new Date();
        const scheduledDateTime = new Date(userDetails.schedule);

        if (scheduledDateTime > currentDateTime) {
            alert('La encuesta no está disponible en este momento');
            setTimeout(() => { window.location.href = "account-category.html"; }, 1000);
            return;
        }
    })
    .catch(error => {
        alert('Error al obtener la informacion de la encuesta');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}