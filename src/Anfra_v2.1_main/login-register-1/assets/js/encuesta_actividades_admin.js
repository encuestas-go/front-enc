const select = document.getElementById('inputjobsituation');

document.addEventListener("DOMContentLoaded", function() {
    fetchUsers();

    document.getElementById("btn-obtener").addEventListener("click", function(event) {
        event.preventDefault();
        fetchSurveyData();
    });


    
    document.getElementById("button-delete").addEventListener("click", function(event) {
        event.preventDefault();
        deleteActivitiesSurvey();
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

function fillSurveyFormIfExist(userDetails) {
        console.log(userDetails);

        document.getElementById('gamespreferences').value = userDetails.preferred_game;
        document.getElementById('sport').value = userDetails.preferred_sport;
        document.getElementById('sportfrequency').value = userDetails.exercise_frequency;

        const checkboxHobbies = {
            'Baile': 'dance', 
            'Tocar algún instrumento': 'playinstrument', 
            'Pintar': 'paint', 
            'Dibujar':'draw', 
            'Hacer ejercicio':'excercise', 
            'Leer':'read', 
            'Salir a caminar':'walk', 
            'Series o películas':'movies', 
            'Otros':'other'
        };
    
        if (userDetails.hobby) {
            const hobbiesArray = userDetails.hobby.split(',');
            hobbiesArray.forEach(hobby => {
                const trimmedHobby = hobby.trim();
                if (checkboxHobbies[trimmedHobby]) {
                    const checkboxId = checkboxHobbies[trimmedHobby];
                    const checkboxElement = document.getElementById(checkboxId);
                    if (checkboxElement) {
                        checkboxElement.checked = true;
                    }
                }
            });
        }

        const checkboxWorkshops = {
            'Habilidades blandas':'abilities', 
            'Técnicos(Con relación a la carrera)':'tecniques', 
            'Bienestar y salud':'health', 
            'Emprendimiento':'entrepreneurship', 
            'Desarrollo personal':'personal', 
            'Otros':'other_workshop'
        };
    
        if (userDetails.workshop_type) {
            const workshopsArray = userDetails.workshop_type.split(',');
            workshopsArray.forEach(workshop => {
                const trimmedWorkshop = workshop.trim();
                if (checkboxWorkshops[trimmedWorkshop]) {
                    const checkboxId = checkboxWorkshops[trimmedWorkshop];
                    const checkboxElement = document.getElementById(checkboxId);
                    if (checkboxElement) {
                        checkboxElement.checked = true;
                    }
                }
            });
        }

        const checkboxEvents = {
            'Festivales': 'festivals', 
            'Conciertos':'concerts',
            'Exposiciones de arte': 'art', 
            'Literatura/poesía':'literature',
            'Bailes':'dances',
            'Charlas/Conferencias':'conferences',
            'Parques recreativos o de diversión':'parks',
            'Otros':'other_events'
        };
    
        if (userDetails.preferred_social_event) {
            const eventsArray = userDetails.preferred_social_event.split(',');
            eventsArray.forEach(event => {
                const trimmedEvent = event.trim();
                if (checkboxEvents[trimmedEvent]) {
                    const checkboxId = checkboxEvents[trimmedEvent];
                    const checkboxElement = document.getElementById(checkboxId);
                    if (checkboxElement) {
                        checkboxElement.checked = true;
                    }
                }
            });
        }
}

function fetchSurveyData() {
    let url = new URL('http://localhost:3000/api/v1/consultar/actividad');
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

        const user = data.data[0];
        const userDetails = {
            id: user.id,
            user_id: user.user_id,
            preferred_game : user.preferred_game ,
            hobby : user.hobby,
            preferred_sport : user.preferred_sport,
            exercise_frequency : user.exercise_frequency ,
            workshop_type : user.workshop_type,
            preferred_social_event :  user.preferred_social_event
        };
        fillSurveyFormIfExist(userDetails);
    })
    .catch(error => {
        alert('Error al obtener la informacion de la encuesta');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });

}

function deleteActivitiesSurvey() {
    let url = new URL('http://localhost:3000/api/v1/eliminar/actividad');
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