const select = document.getElementById('inputjobsituation');

document.addEventListener("DOMContentLoaded", function() {
    fetchUsers();

    document.getElementById("btn-obtener").addEventListener("click", function(event) {
        event.preventDefault();
        fetchSurveyData();
    });

    document.getElementById("button-delete").addEventListener("click", function(event) {
        event.preventDefault();
        deleteSocioeconomicSurvey();
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
    let url = new URL('http://localhost:3000/api/v1/consultar/nivelSocioeconomico');
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
            id: user.id,
            id_user: user.id_user,
            full_name: user.full_name,
            birth_date: user.birth_date,
            nationality: user.nationality,
            age: user.age,
            degree_aspired: user.degree_aspired,
            gender: user.gender,
            language: user.language,
            last_degree_father: user.last_degree_father,
            last_degree_mother: user.last_degree_mother,
            marital_status: user.marital_status,
            longitude: user.longitude,
            latitude: user.latitude,
            residence_address: user.residence_address,
            socioeconomic_status: user.socioeconomic_status,
            state: user.state
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
    document.getElementById('inputfullname').value = userDetails.full_name;
    document.getElementById('nationality').value = userDetails.nationality;
    document.getElementById('inputidioma').value = userDetails.language;

    const birthDate = new Date(userDetails.birth_date);
    document.getElementById('inputday').value = birthDate.getDate();
    document.getElementById('inputmonth').value = String(birthDate.getMonth() + 1).padStart(2, '0');
    document.getElementById('inputyear').value = birthDate.getFullYear();

    document.getElementById('inputsex').value = userDetails.gender;
    document.getElementById('inputcivil').value = userDetails.marital_status;
    document.getElementById('inputsocioeconomico').value = userDetails.socioeconomic_status;
    document.getElementById('inputedu').value = userDetails.degree_aspired;
    document.getElementById('inputestpadre').value = userDetails.last_degree_father;
    document.getElementById('inputestmadre').value = userDetails.last_degree_mother;
    document.getElementById('inputage').value = userDetails.age;

    updateMap(userDetails.latitude, userDetails.longitude, userDetails.residence_address);
}


function deleteSocioeconomicSurvey() {
    let url = new URL('http://localhost:3000/api/v1/eliminar/nivelSocioeconomico');
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