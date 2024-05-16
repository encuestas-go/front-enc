var existData = false;
hideDeleteButton();

document.addEventListener("DOMContentLoaded", function() {
    
    fetchSurveyData();

    document.getElementById("button-delete").addEventListener("click", function(event) {
        event.preventDefault();
        console.log("El botón de eliminar fue clicado");
    });

    document.getElementById("commentForm").addEventListener("submit", function(event) {
        event.preventDefault();

        if (existData) {
            updateSocioeconomicSurvey();
        } else {
            createNewSocioeconomicSurvey();
        }
    })
});

function fetchSurveyData() {
    let url = new URL('http://localhost:3000/api/v1/consultar/nivelSocioeconomico');
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
            id_user: user.id_user,
            full_name: user.full_name,
            birth_date: user.birth_date,
            nationality: user.nationality,
            age: user.age,
            degree_aspired: user.degree_aspired,
            gender: user.gender,
            language: user.language,
            last_degree_father: user.last_degree_father,
            last_degree_mother: user.last_degree_mother,
            marital_status: user.marital_status,
            postal_code: user.postal_code,
            residence_address: user.residence_address,
            residence_city: user.residence_city,
            socioeconomic_status: user.socioeconomic_status,
            state: user.state
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
    document.getElementById('inputfullname').value = userDetails.full_name;
    document.getElementById('nationality').value = userDetails.nationality;
    document.getElementById('inputaddress').value = userDetails.residence_address;
    document.getElementById('inputrescity').value = userDetails.residence_city;
    document.getElementById('postalcode').value = userDetails.postal_code;
    document.getElementById('inputentifede').value = userDetails.state;
    document.getElementById('inputidioma').value = userDetails.language;

    const birthDate = new Date(userDetails.birth_date);
    document.getElementById('inputday').value = birthDate.getDate();
    document.getElementById('inputmonth').value = String(birthDate.getMonth() + 1).padStart(2, '0');
    document.getElementById('inputyear').value = birthDate.getFullYear();

    document.getElementById('inputsex').value = userDetails.gender;
    document.getElementById('inputcivil').value = userDetails.marital_status;
    document.getElementById('inputsocioeconomico').value = userDetails.socioeconomic_status;
    document.getElementById('inputedu').value = userDetails.degree_aspired;
    document.getElementById('inputestpadre').value = userDetails.last_degree_father;
    document.getElementById('inputestmadre').value = userDetails.last_degree_mother;
    document.getElementById('inputage').value = userDetails.age;
}

function createNewSocioeconomicSurvey() {
    let url = new URL('http://localhost:3000/api/v1/crear/nivelSocioeconomico');
    let survey = getSocieconomicData();
    
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

        alert('creada con exito');
        setTimeout(() => {}, 3000); 
        location.reload(true); 
    })
    .catch(error => {
        alert('Error al crear encuesta');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}

function getSocieconomicData() {
    const day = getHTMLValue('inputday');
    const month = getHTMLValue('inputmonth');
    const year = getHTMLValue('inputyear');

    return {
        "id_user": convertToInteger( getCookie('id_user') ),
        "full_name": getHTMLValue('inputfullname'),
        "birth_date": `${year}/${month}/${day}`,
        "nationality": getHTMLValue('nationality'),
        "gender": getHTMLValue('inputsex'),
        "age": convertToInteger( getHTMLValue('inputage') ),
        "marital_status": getHTMLValue('inputcivil'),
        "residence_address": getHTMLValue('inputaddress'),
        "residence_city": getHTMLValue('inputrescity'),
        "postal_code": convertToInteger( getHTMLValue('postalcode') ),
        "state": getHTMLValue('inputentifede'),
        "socioeconomic_status": getHTMLValue('inputsocioeconomico'),
        "language": getHTMLValue('inputidioma'),
        "degree_aspired": getHTMLValue('inputedu'),
        "last_degree_father": getHTMLValue('inputestpadre'),
        "last_degree_mother": getHTMLValue('inputestmadre')
    }
}

function updateSocioeconomicSurvey() {
    let url = new URL('http://localhost:3000/api/v1/actualizar/nivelSocioeconomico');
    let survey = getSocieconomicData();

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
            throw new Error('Failed to update data'); 
        }
    })
    .then(data => {
        if (data.status_code && data.status_code != 200) {
            alert('Error al actualizar la encuesta');
            setTimeout(() => {}, 2000); 
            return;
        }

        // TODO: Modal with timer: event.preventDefault();
        // min char not required
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


function deleteSocioeconomicSurvey() {
    let url = new URL('http://localhost:3000/api/v1/eliminar/nivelSocioeconomico');
    url.searchParams.append('user_id', getCookie('id_user'));
    
    if (!areAllValuesValid(survey)) {
        alert('Llena todos los valor en la encuesta');
        return;
    }

    fetch(url, {
        method: 'DELETE', 
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