var existData = false;


document.addEventListener("DOMContentLoaded", function() {

    fetchSurveyData();
    
    document.getElementById("commentForm").addEventListener("submit", function(event) {
        event.preventDefault();

        if (!existData) {
            createNewEconomicSurvey();
        } else {
            updateEconomicSurvey();
        }
    })
});


function createNewEconomicSurvey() {
    let url = new URL('http://localhost:3000/api/v1/crear/nivelEconomico');
    let survey = getEconomicData();
    
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

function getEconomicData() {
    const ids = ['PTU', 'IMSS/ISSSTEIMSS/ISSSTE', 'SAR', 'SegPriv', 'SegPub'];

    const selected = ids.filter(id => {
        const element = document.getElementById(id);
        return element && element.checked; 
    })
    .map(id => {
        const label = document.querySelector(`label[for="${id}"]`);
        return label ? label.textContent : ''; 
    });
    
    const selectedValues = selected.join(',');

    return{
        "id_user": convertToInteger( getCookie('id_user') ),
        "current_status": getHTMLValue('inputjobsituation'),
        "job_title": getHTMLValue('inputjobtitle') ,
        "employer_establishment": getHTMLValue('inputplacejob') ,
        "employment_type": getHTMLValue('inputtypejob'),
        "salary": convertToInteger( getHTMLValue('inputsalary') ) ,
        "amount_type": getHTMLValue('inputtypesalary') ,
        "work_benefits_type": selectedValues,
    }
}

function fetchSurveyData() {
    let url = new URL('http://localhost:3000/api/v1/consultar/nivelEconomico');
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
            current_status: user.current_status,
            job_title: user.job_title,
            employer_establishment: user.employer_establishment,
            employment_type: user.employment_type,
            salary: user.salary,
            amount_type: user.amount_type,
            work_benefits_type: user.work_benefits_type,
        };
        
        fillSurveyFormIfExist(userDetails);
    })
    .catch(error => {
        alert('Error al obtener la informacion de la encuesta');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}

function fillSurveyFormIfExist(userDetails) {
        document.getElementById('inputjobsituation').value = userDetails.current_status;
        document.getElementById('inputjobtitle').value = userDetails.job_title;
        document.getElementById('inputplacejob').value = userDetails.employer_establishment;
        document.getElementById('inputtypejob').value = userDetails.employment_type;
        document.getElementById('inputsalary').value = userDetails.salary;
        document.getElementById('inputtypesalary').value = userDetails.amount_type;

     const checkboxLabels = {
        'Participación de Utilidades': 'PTU',
        'IMSS/ISSSTE': 'IMSS/ISSSTE',
        'SAR': 'SAR',
        'Segurado Medico Particular': 'SegPriv',
        'Seguro Medico': 'SegPub'
    };

    if (userDetails.work_benefits_type) {
        const benefitsArray = userDetails.work_benefits_type.split(',');
        benefitsArray.forEach(benefit => {
            const trimmedBenefit = benefit.trim();
            if (checkboxLabels[trimmedBenefit]) {
                const checkboxId = checkboxLabels[trimmedBenefit];
                const checkboxElement = document.getElementById(checkboxId);
                if (checkboxElement) {
                    checkboxElement.checked = true;
                }
            }
        });
    }
    
}

function updateEconomicSurvey() {
    let url = new URL('http://localhost:3000/api/v1/actualizar/nivelEconomico');
    let survey = getEconomicData();
    
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


function deleteEconomicSurvey() {
    let url = new URL('http://localhost:3000/api/v1/eliminar/nivelEconomico');
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