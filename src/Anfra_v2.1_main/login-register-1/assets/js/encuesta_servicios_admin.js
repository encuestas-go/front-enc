const select = document.getElementById('inputjobsituation');

document.addEventListener("DOMContentLoaded", function() {
    fetchUsers();

    document.getElementById("btn-obtener").addEventListener("click", function(event) {
        event.preventDefault();
        fetchSurveyData();
    });


    
    document.getElementById("button-delete").addEventListener("click", function(event) {
        event.preventDefault();
        deleteServiceSurvey();
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


function fillSurveyFormIfExist(userDetails) {
    document.getElementById('internetprovider').value = userDetails.internet_provider;
    document.getElementById('paytime').value = userDetails.payment_due_date;
    document.getElementById('costbasic').value = userDetails.services_bill;

    const checkboxAddPayments = {
        'Saldo/Plan Telefónico': 'checkphone', 
        'Entretenimiento (Netflix|Youtube Premium|Amazon Prime|Spotify...)': 'checkentretainment', 
        'Otros': 'checkother'
    };

    if (userDetails.additional_payments) {
        const additionalArray = userDetails.additional_payments.split(',');
        additionalArray.forEach(payment => {
            const trimmedPay= payment.trim();
            if (checkboxAddPayments[trimmedPay]) {
                const checkboxId = checkboxAddPayments[trimmedPay];
                const checkboxElement = document.getElementById(checkboxId);
                if (checkboxElement) {
                    checkboxElement.checked = true;
                }
            }
        });
    }

    if (userDetails.energy_provider) {
        document.querySelector('input[name="light"][value="Si"]').checked = true;
    } else {
        document.querySelector('input[name="light"][value="No"]').checked = true;
    }

    if (userDetails.water_provider) {
        document.querySelector('input[name="water"][value="Si"]').checked = true;
    } else {
        document.querySelector('input[name="water"][value="No"]').checked = true;
    }

    if (userDetails.phone_provider) {
        document.querySelector('input[name="phone"][value="Si"]').checked = true;
    } else {
        document.querySelector('input[name="phone"][value="No"]').checked = true;
    }

    if (userDetails.tv_provider) {
        document.querySelector('input[name="tv"][value="Si"]').checked = true;
    } else {
        document.querySelector('input[name="tv"][value="No"]').checked = true;
    }

}

function fetchSurveyData() {
    let url = new URL('http://localhost:3000/api/v1/consultar/servicio');
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
            user_id: user.id_user,
            energy_provider : user.energy_provider,
            water_provider: user.water_provider ,
            internet_provider : user. internet_provider,
            phone_provider: user.phone_provider,
            tv_provider : user.tv_provider,
            payment_due_date : user.payment_due_date,
            additional_payments: user.additional_payments,
            services_bill: user.services_bill
        };
    
        fillSurveyFormIfExist(userDetails);
    })
    .catch(error => {
        alert('Error al obtener la informacion de la encuesta');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}



function deleteServiceSurvey() {
    let url = new URL('http://localhost:3000/api/v1/eliminar/servicio');
    url.searchParams.append('user_id', select.value);

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



