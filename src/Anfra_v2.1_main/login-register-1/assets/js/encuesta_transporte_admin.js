const select = document.getElementById('inputjobsituation');

document.addEventListener("DOMContentLoaded", function() {
    fetchUsers();

    document.getElementById("btn-obtener").addEventListener("click", function(event) {
        event.preventDefault();
        fetchSurveyData();
    });

    document.getElementById("button-delete").addEventListener("click", function(event) {
        event.preventDefault();
        deleteTransportSurvey();
    });
    
});


function fetchUsers() {
    const url = new URL('http://localhost:3000/api/v1/consultar/usuario');
    url.searchParams.append('only_students', 'true');

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
            throw new Error('Failed to fetch users');
        }
    })
    .then(data => {
        if (data.status_code !== 200) {
            alert('Error al obtener los usuarios');
            return;
        }
        const users = data.data;
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.name} ${user.middle_name || ''} ${user.last_name}`;
            select.appendChild(option);
        });
    })
    .catch(error => {
        alert('Error al obtener los usuarios');
        console.error('Error:', error);
    });
}


function fetchSurveyData() {
    let url = new URL('http://localhost:3000/api/v1/consultar/medioTransporte');
    url.searchParams.append('user_id', select.value);

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