document.addEventListener("DOMContentLoaded", function() {
    getMapReportData();

});

function getMapReportData(start_date, end_date) {
    let url = new URL('http://localhost:3000/api/v1/consultar/nivelSocioeconomico');

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
            alert('Error al obtener la informacion de transporte');
            setTimeout(() => {}, 2000); 
            return;
        }

        if (data.data && data.data.length == 0) {
            existData = false;
            return;
        }

        initMap(data.data);
    })
    .catch(error => {
        alert('Error al obtener la informacion de transporte');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}

function initMap(studentLocations) {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 18.7813, lng: -99.1013 }, // Coordenadas aproximadas de Morelos
        zoom: 9.7
    });

    studentLocations.forEach(student => {
        var marker = new google.maps.Marker({
            position: { lat: student.latitude, lng: student.longitude },
            map: map,
            title: student.full_name
        });
    });
}