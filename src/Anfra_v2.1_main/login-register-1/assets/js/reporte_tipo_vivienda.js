const initialData = [
    { housing_type: 'Casa', house_condition: 'Propia', quantity: 10 },
    { housing_type: 'Casa', house_condition: 'Rentada', quantity: 20 },
    { housing_type: 'Departamento', house_condition: 'Propia', quantity: 15 },
    { housing_type: 'Departamento', house_condition: 'Rentada', quantity: 25 }
];

const initialGroupedData = initialData.reduce((acc, item) => {
    const key = `${item.housing_type} - ${item.house_condition}`;
    if (!acc[key]) {
        acc[key] = 0;
    }
    acc[key] += item.quantity;
    return acc;
}, {});

const initialLabels = Object.keys(initialGroupedData);
const initialQuantities = Object.values(initialGroupedData);

const data = {
    labels: initialLabels,
    datasets: [{
        label: 'Cantidad de Alumnos',
        data: initialQuantities,
        backgroundColor: initialLabels.map(() => getRandomColor())
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
                text: 'Stacked Bar Chart for Housing and Condition Types'
            }
        }
    },
};

const ctx = document.getElementById('myPolarAreaChart').getContext('2d');
const myStackedBarChart = new Chart(ctx, config);

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

    document.getElementById("commentForm").addEventListener("submit", function(event) {
        event.preventDefault();
        window.print();
    })
});

function checkDates() {
    const date1 = $('#datePicker').datepicker('getDate');
    const date2 = $('#datePicker-2').datepicker('getDate');

    if (date1 && date2) {
        let date1Variable = formatDate(date1);
        let date2Variable = formatDate(date2);
        getHouseConditionReportData(date1Variable, date2Variable);
    } 
}

function getHouseConditionReportData(start_date, end_date) {
    let url = new URL('http://localhost:3000/api/v1/reporte/TipoViviendaCondicion');
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
            alert('Error al obtener la informacion de tipo de vivienda y condición');
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
        alert('Error al obtener la informacion de tipo de vivienda y condición');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}

function updateChart(data) {
    const groupedData = {};

    data.forEach(item => {
        const key = `${item.housing_type} - ${item.house_condition}`;
        if (!groupedData[key]) {
            groupedData[key] = 0;
        }
        groupedData[key] += item.quantity;
    });

    const labels = Object.keys(groupedData);
    const quantities = Object.values(groupedData);

    myStackedBarChart.data.labels = labels;
    myStackedBarChart.data.datasets[0].data = quantities;
    myStackedBarChart.update();
}