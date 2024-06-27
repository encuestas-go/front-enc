var existData = false;

document.addEventListener("DOMContentLoaded", function() {
    $(document).ready(function() {
        $('#datePicker').datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayHighlight: true
        }).on('changeDate');
    });

    fetchSurveyData();
    document.getElementById("button-delete").addEventListener("click", function(event) {
        event.preventDefault();
        deleteEvent();
    });

    document.getElementById("commentForm").addEventListener("submit", function(event) {
        event.preventDefault();

        if (!existData) {
            createEventPublishment();
        } else {
            updateEventPublishment();
        }
    })
});


function createEventPublishment() {
    let url = new URL('http://localhost:3000/api/v1/crear/evento');
    let survey = getEventData();
    
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

function getEventData() {
    const date1 = $('#datePicker').datepicker('getDate');
    let date1Variable = formatDate(date1);

    return{
        "event_name" : getHTMLValue('name_event') ,
        "date" : date1Variable,
        "hour" : getHTMLValue('time'),
        "place" :getHTMLValue('place_event'),
        "description" :getHTMLValue('event_description') ,
        "category" : getHTMLValue('category_event'),
        "id_user" : convertToInteger( getCookie('id_user') )
    }
}

function fillSurveyFormIfExist(userDetails) {
    document.getElementById('name_event').value = userDetails.event_name;

    const eventDate = new Date(userDetails.date);
    $('#datePicker').datepicker('update', eventDate); 

    document.getElementById('time').value = userDetails.hour;
    document.getElementById('place_event').value = userDetails.place;
    document.getElementById('event_description').value = userDetails.description;
    document.getElementById('category_event').value = userDetails.category;
}

function fetchSurveyData() {
    let url = new URL('http://localhost:3000/api/v1/consultar/evento');
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
            event_name :  user.event_name,
            date : user.date,
            hour : user.hour,
            place : user.place,
            description : user.description,
            category :user.category,
            id_user: user.id_user,

        };
    
        fillSurveyFormIfExist(userDetails);
    })
    .catch(error => {
        alert('Error al obtener la informacion de la encuesta');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}

function updateEventPublishment() {
    let url = new URL('http://localhost:3000/api/v1/actualizar/evento');
    let survey = getEventData();

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

function deleteEvent() {
    let url = new URL('http://localhost:3000/api/v1/eliminar/evento');
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