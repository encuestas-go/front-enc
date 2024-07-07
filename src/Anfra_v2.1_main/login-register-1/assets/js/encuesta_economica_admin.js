const select = document.getElementById('inputjobsituation');

document.addEventListener("DOMContentLoaded", function() {
    fetchUsers();

    document.getElementById("btn-obtener").addEventListener("click", function(event) {
        event.preventDefault();
        fetchSurveyData();
    });

    document.getElementById("button-delete").addEventListener("click", function(event) {
        event.preventDefault();
        deleteEconomicSurvey();
    });
    
});


function fetchUsers() {
    const url = new URL('http://localhost:3000/api/v1/consultar/usuario');
    url.searchParams.append('only_students', 'true');

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
            option.value = user.id;
            option.textContent = `${user.name} ${user.middle_name || ''} ${user.last_name}`;
            select.appendChild(option);
        });
    })
    .catch(error => {
        alert('Error al obtener los usuarios');
        console.error('Error:', error);
    });
}


function fetchSurveyData() {
    let url = new URL('http://localhost:3000/api/v1/consultar/nivelEconomico');
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

        existData = true;
        changeButtonContent();
        showDeleteButton();

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


function deleteEconomicSurvey() {
    let url = new URL('http://localhost:3000/api/v1/eliminar/nivelEconomico');
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