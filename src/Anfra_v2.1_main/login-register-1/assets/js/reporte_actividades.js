const initialLabels = [
    'Baile', 'Tocar algún instrumento', 'Pintar', 'Dibujar', 'Hacer ejercicio',
    'Leer', 'Salir a caminar', 'Series o películas', 'Otras actividades', 'Festivales',
    'Conciertos', 'Exposiciones de arte', 'Literatura/poesía', 'Bailes', 'Charlas/Conferencias',
    'Parques recreativos o de diversión', 'Otros eventos'
];
const initialData = [
    5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4
];

const data = {
    labels: initialLabels,
    datasets: [{
        label: 'Actividades culturales y eventos sociales',
        data: initialData,
        backgroundColor: [
            'rgba(255, 99, 132, 0.5)', 'rgba(255, 159, 64, 0.5)', 'rgba(255, 205, 86, 0.5)', 
            'rgba(75, 192, 192, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(153, 102, 255, 0.5)',
            'rgba(201, 203, 207, 0.5)', 'rgba(255, 158, 64, 0.5)', 'rgba(255, 206, 86, 0.5)', 
            'rgba(75, 192, 192, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(153, 102, 255, 0.5)',
            'rgba(201, 203, 207, 0.5)', 'rgba(255, 159, 64, 0.5)', 'rgba(255, 205, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)', 'rgba(54, 162, 235, 0.5)'
        ]
    }]
};


const config = {
    type: 'polarArea',
    data: data,
    options: {
        responsive: true,
        scales: {
            r: {
                pointLabels: {
                    display: true,
                    centerPointLabels: true,
                    font: {
                        size: 18
                    }
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Gráfico de área polar de actividades culturales y eventos sociales'
            }
        }
    },
};

const ctx = document.getElementById('myPolarAreaChart').getContext('2d');
const myPolarAreaChart = new Chart(ctx, config);

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
        console.log(response);
        if (response.ok) {
            return response.json(); 
        } else {
            throw new Error('Failed to fetch data'); 
        }
    })
    .then(data => {
        console.log(data);
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
        'Baile', 'Tocar algún instrumento', 'Pintar', 'Dibujar', 'Hacer ejercicio',
        'Leer', 'Salir a caminar', 'Series o películas', 'Otras actividades', 'Festivales',
        'Conciertos', 'Exposiciones de arte', 'Literatura/poesía', 'Bailes', 'Charlas/Conferencias',
        'Parques recreativos o de diversión', 'Otros eventos'
    ];
    const quantities = [
        data.dance, data.play_instrument, data.paint, data.draw, data.do_exercise,
        data.read, data.go_walking, data.movies, data.other_activities, data.festivals,
        data.concerts, data.art_exposition, data.literature_poesia, data.dances, data.conferences,
        data.recreational_parks, data.other_events
    ];

    myPolarAreaChart.data.labels = labels;
    myPolarAreaChart.data.datasets[0].data = quantities;
    myPolarAreaChart.update();
}

