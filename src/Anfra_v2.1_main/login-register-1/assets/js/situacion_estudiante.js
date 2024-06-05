function generateReport() {
    // Aquí va el código para generar el reporte dinámicamente
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Ejemplo de datos generados
    const data = [
        { situacion: 'Inscritos', cantidad: 30 },
        { situacion: 'No inscritos', cantidad: 5 },
        { situacion: 'Graduados', cantidad: 10 }
    ];

    const tbody = document.querySelector('#reportTable tbody');
    tbody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.situacion}</td><td>${row.cantidad}</td>`;
        tbody.appendChild(tr);
    });
}

function downloadPDF() {
    window.print(); // Utiliza la función de impresión del navegador
}

/*const { jsPDF } = window.jspdf;

async function fetchReportData(startDate, endDate) {
    // Simulación de datos que se obtendrían del servidor
    const reportData = [
        { CurrentSituation: 'Buena', Quantity: 150 },
        { CurrentSituation: 'Regular', Quantity: 80 },
        { CurrentSituation: 'Mala', Quantity: 40 },
    ];

    return reportData;
}

async function generateReport() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        alert("Por favor, selecciona las fechas de inicio y fin.");
        return;
    }

    const data = await fetchReportData(startDate, endDate);

    const tbody = document.getElementById('reportTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Limpiar tabla

    data.forEach(report => {
        const row = tbody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.textContent = report.CurrentSituation;
        cell2.textContent = report.Quantity;
    });
}

function downloadPDF() {
    const doc = new jsPDF();

    doc.text('Reporte de Situación Estudiantil', 10, 10);

    const table = document.getElementById('reportTable');
    let rowIndex = 20;
    
    for (let row of table.rows) {
        let colIndex = 10;
        for (let cell of row.cells) {
            doc.text(cell.innerText, colIndex, rowIndex);
            colIndex += 40;
        }
        rowIndex += 10;
    }

    doc.save('reporte_estudiantil.pdf');
}
*/
