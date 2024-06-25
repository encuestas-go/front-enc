// Datos iniciales dummy (si es necesario)
const initialData = {
    dance: 10, play_instrument: 15, paint: 5, draw: 8, do_exercise: 12, read: 20,
    go_walking: 7, movies: 9, other_activities: 4, festivals: 13, concerts: 16,
    art_exposition: 6, literature_poetry: 3, dances: 11, conferences: 14,
    recreational_parks: 10, other_events: 5
};

const labels = [
    'Dance', 'Play Instrument', 'Paint', 'Draw', 'Do Exercise', 'Read',
    'Go Walking', 'Movies', 'Other Activities', 'Festivals', 'Concerts',
    'Art Exposition', 'Literature Poetry', 'Dances', 'Conferences',
    'Recreational Parks', 'Other Events'
];

const data = {
    labels: labels,
    datasets: [{
        label: 'Cultural Activities',
        data: Object.values(initialData),
        backgroundColor: 'rgba(75, 192, 192, 0.5)'
    }]
};

const config = {
    type: 'bar',
    data: data,
    options: {
        responsive: true,
        scales: {
            x: {
                stacked: true
            },
            y: {
                stacked: true
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Cultural Activities Report'
            }
        }
    },
};

const ctx = document.getElementById('myPolarAreaChart').getContext('2d');
const myBarChart = new Chart(ctx, config);

document.addEventListener("DOMContentLoaded", function() {
    $(document).ready(function() {
        $('#datePicker').datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayHighlight: true
        }).on('changeDate', checkDates);
    
        $('#datePicker-2').datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            todayHighlight: true
        }).on('changeDate', checkDates);
    });
});

function checkDates() {
    const date1 = $('#datePicker').datepicker('getDate');
    const date2 = $('#datePicker-2').datepicker('getDate');

    if (date1 && date2) {
        let date1Variable = formatDate(date1);
        let date2Variable = formatDate(date2);
        getActivitiesReportData(date1Variable, date2Variable);
    } 
}

function getActivitiesReportData(start_date, end_date) {
    let url = new URL('http://localhost:3000/api/v1/reporte/PreferenciasActividades');
    url.searchParams.append('start_date', start_date);
    url.searchParams.append('end_date', end_date);

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

        updateChart(data.data);
    })
    .catch(error => {
        alert('Error al obtener la informacion de transporte');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}


function updateChart(data) {
    const labels = [
        'Baile', 'Tocar algún instrumento', 'Pintar', 'Dibujar', 'Hacer ejercicio', 'Leer',
        'Salir a caminar', 'Series o películas', 'Otras actividades', 'Festivales', 'Conciertos',
        'Exposiciones de arte', 'Literatura/poesía', 'Bailes', 'Charlas/Conferencias',
        'Parques recreativos o de diversión', 'Otros eventos'
    ];

    const quantities = [
        data.dance, data.play_instrument, data.paint, data.draw, data.do_exercise, data.read,
        data.go_walking, data.movies, data.other_activities, data.festivals, data.concerts,
        data.art_exposition, data.literature_poetry, data.dances, data.conferences,
        data.recreational_parks, data.other_events
    ];

    myBarChart.data.labels = labels;
    myBarChart.data.datasets[0].data = quantities;
    myBarChart.update();
}
