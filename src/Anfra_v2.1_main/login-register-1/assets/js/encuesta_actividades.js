var existData = false;

document.addEventListener("DOMContentLoaded", function() {
    fetchSurveyData();
    document.getElementById("commentForm").addEventListener("submit", function(event) {
        event.preventDefault();

        if (!existData) {
            createActivitiesSurvey();
        } else {
            updateActivitiesSurvey();
        }
    })
});

function createActivitiesSurvey() {
    let url = new URL('http://localhost:3000/api/v1/crear/actividad');
    let survey = getActivitiesData();
    
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

function getActivitiesData() {
    const idsHobbies = ['dance', 'playinstrument', 'paint', 'draw', 'excercise', 'read', 'walk', 'movies', 'other'];
    const selectedHobbies = idsHobbies.filter(id => {
        const element = document.getElementById(id);
        return element && element.checked; 
    }).map(id => {
        const label = document.querySelector(`label[for="${id}"]`);
        return label ? label.textContent : ''; 
    }).join(',');


    const idsWorkshop = ['abilities', 'tecniques', 'health', 'entrepreneurship', 'personal', 'other'];
    const selectedWorkshops = idsWorkshop.filter(id => {
        const element = document.getElementById(id);
        return element && element.checked; 
    }).map(id => {
        const label = document.querySelector(`label[for="${id}"]`);
        return label ? label.textContent : ''; 
    }).join(',');

    const idsEvents = ['festivals', 'concerts', 'art', 'literature', 'dances', 'conferences', 'parks', 'other'];
    const selectedEvents= idsEvents.filter(id => {
        const element = document.getElementById(id);
        return element && element.checked; 
    }).map(id => {
        const label = document.querySelector(`label[for="${id}"]`);
        return label ? label.textContent : ''; 
    }).join(',');

    return{
        "user_id": convertToInteger( getCookie('id_user') ),
        "preferred_game" : getHTMLValue('gamespreferences'),
        "hobby" : selectedHobbies,
        "preferred_sport" :getHTMLValue('sport') ,
        "exercise_frequency" :getHTMLValue('sportfrequency') ,
        "workshop_type" : selectedWorkshops,
        "preferred_social_event" : selectedEvents
    }
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

function updateActivitiesSurvey() {
    let url = new URL('http://localhost:3000/api/v1/actualizar/actividad');
    let survey = getActivitiesData();
    
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

function deleteActivitiesSurvey() {
    let url = new URL('http://localhost:3000/api/v1/eliminar/actividad');
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