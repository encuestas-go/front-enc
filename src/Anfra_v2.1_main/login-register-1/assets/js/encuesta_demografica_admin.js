const select = document.getElementById('inputjobsituation');

document.addEventListener("DOMContentLoaded", function() {
    fetchUsers();

    document.getElementById("btn-obtener").addEventListener("click", function(event) {
        event.preventDefault();
        fetchSurveyData();
    });

    document.getElementById("button-delete").addEventListener("click", function(event) {
        event.preventDefault();
        deleteDemographicSurvey();
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
    document.getElementById('inputhousingtype').value = userDetails.housing_type;
    document.getElementById('housecondition').value = userDetails.house_condition;
    document.getElementById('owntransport').value = userDetails.own_transport.toString();
    document.getElementById('incomeamount').value = userDetails.income_amount;
    document.getElementById('workingmembers').value = userDetails.working_members;
    document.getElementById('underage').value = userDetails.members_underage;
    document.getElementById('monthlyexpenses').value = userDetails.monthly_expenses;
    document.getElementById('govermentsupport').value = userDetails.goverment_support.toString();
}

function fetchSurveyData() {
    let url = new URL('http://localhost:3000/api/v1/consultar/nivelDemografico');
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
            alert('Error al obtener la informacion de la encuesta demográfica');
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
            id: user.id,
            user_id: user.user_id,
            housing_type: user.housing_type,
            house_condition:  user.house_condition,
            own_transport: user.own_transport,
            income_amount: user.income_amount,
            working_members : user.working_members,
            members_underage: user.members_underage,
            monthly_expenses: user.monthly_expenses,
            goverment_support: user.goverment_support
        };
        
        fillSurveyFormIfExist(userDetails);
    })
    .catch(error => {
        alert('Error al obtener la informacion de la encuesta demográfica');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}


function deleteDemographicSurvey() {
    let url = new URL('http://localhost:3000/api/v1/eliminar/nivelDemografico');
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
