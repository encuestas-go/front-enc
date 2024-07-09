const select = document.getElementById('inputjobsituation');

document.addEventListener("DOMContentLoaded", function() {
    $(document).ready(function() {
        $('#datePicker').datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayHighlight: true
        }).on('changeDate');
    });

    fetchUsers();

    document.getElementById("btn-obtener").addEventListener("click", function(event) {
        event.preventDefault();
        fetchSurveyData();
    });
});

function fetchUsers() {
    const url = new URL('http://localhost:3000/api/v1/consultar/evento');

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
            option.value = user.id_user;
            option.textContent = `${user.event_name} | ${user.id || ''}`;
            select.appendChild(option);
        });
    })
    .catch(error => {
        alert('Error al obtener los usuarios');
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
