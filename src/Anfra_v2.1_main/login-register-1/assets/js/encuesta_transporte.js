var existData = false;
hideDeleteButton();

document.addEventListener("DOMContentLoaded", function() {
    
    fetchSurveyData();
    document.getElementById("button-delete").addEventListener("click", function(event) {
        event.preventDefault();
        deleteTransportSurvey();
    });

    document.getElementById("commentForm").addEventListener("submit", function(event) {
        event.preventDefault();

        if (existData) {
            updateTransportSurvey();
        } else {
            createTransportSurvey();
        }
    })
});


function createTransportSurvey(){
    let url = new URL('http://localhost:3000/api/v1/crear/medioTransporte');
    let survey = getTransportData();
    console.log(survey);
    
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

function updateTransportSurvey(){
    let url = new URL('http://localhost:3000/api/v1/actualizar/medioTransporte');
    let survey = getTransportData();

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

function fetchSurveyData() {
    let url = new URL('http://localhost:3000/api/v1/consultar/medioTransporte');
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
            user_id: user.user_id,
            primary_transport: user.primary_transport,
            second_transport: user.second_transport,
            usage_frequency: user.usage_frequency,
            accesible_points: user.accesible_points,
            frequent_destination: user.frequent_destination,
            travel_time: user.travel_time
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
    document.getElementById('primarytrans').value = userDetails.primary_transport;
    document.getElementById('secondarytrans').value = userDetails.second_transport;
    document.getElementById('frecuencytrans').value = userDetails.usage_frequency;

    console.log(userDetails);
    document.getElementById('accesspoint').value = userDetails.accesible_points.toString();
    document.getElementById('frecuentdest').value = userDetails.frequent_destination;
    document.getElementById('arrivetime').value = userDetails.travel_time;
}

function getTransportData() {
    return {
        "user_id": convertToInteger(getCookie('id_user')),
        "primary_transport": getHTMLValue('primarytrans'),
        "second_transport": getHTMLValue('secondarytrans'),
        "usage_frequency": getHTMLValue('frecuencytrans'),
        "accesible_points": convertToBoolean(getHTMLValue('accesspoint')),
        "frequent_destination": getHTMLValue('frecuentdest'),
        "travel_time": getHTMLValue('arrivetime')
    }
}

function deleteTransportSurvey() {
    let url = new URL('http://localhost:3000/api/v1/eliminar/medioTransporte');
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

