document.addEventListener("DOMContentLoaded", function() {
    $(document).ready(function() {
        $('#datePicker').datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayHighlight: true
        }).on('changeDate');
    });


    document.getElementById("commentForm").addEventListener("submit", function(event) {
        event.preventDefault();

        createScheduledEvent();
    })
});

function createScheduledEvent() {
    let url = new URL('http://localhost:3000/api/v1/crear/encuestaSatisfaccion');
    url.searchParams.append('id_user', getCookie('id_user'));

    const date1 = $('#datePicker').datepicker('getDate');
    let date1Variable = formatDate(date1);

    let time = getHTMLValue('time');

    let date = `${date1Variable} ${time}:00`

    url.searchParams.append('scheduled_date', date);

    fetch(url, {
        method: 'POST', 
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
        if (data.status_code && data.status_code != 201) {
            alert('Error al crear la  encuesta');
            setTimeout(() => {}, 2000); 
            return;
        }

        alert('programacion creada con exito');
        setTimeout(() => {}, 3000); 
        location.reload(true); 
    })
    .catch(error => {
        alert('Error al crear programacion');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });

}