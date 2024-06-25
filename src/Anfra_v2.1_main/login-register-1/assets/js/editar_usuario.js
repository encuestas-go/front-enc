let id_user_type = 0;

document.addEventListener("DOMContentLoaded", function() {
    // Cargar datos del usuario al cargar la página
    fetchUserData();

    // Manejar el submit del formulario
    document.getElementById('commentForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const user = getUserData();
        console.log(user);
        updateUser(user);
    });
});

// Función para obtener los datos del usuario desde el formulario
function getUserData() {
    return {
        id: convertToInteger(getCookie('id_user')),
        name: document.getElementById('name').value,
        middle_name: document.getElementById('middle_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        phone_number: document.getElementById('phone_number').value,
        username: document.getElementById('username').value,
        id_user_type: id_user_type
    };
}

// Función para actualizar el usuario
function updateUser(user) {
    const url = new URL(`http://localhost:3000/api/v1/actualizar/usuario`);
    url.searchParams.append('user_id', user.id);

    fetch(url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to update user');
        }
    })
    .then(data => {
        if (data.status_code !== 200) {
            alert('Error al actualizar el usuario');
            return;
        }
        alert('Usuario actualizado con éxito');
        setTimeout(() => location.reload(true), 3000);
    })
    .catch(error => {
        alert('Error al actualizar el usuario');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error);
    });
}

 // Función para llenar el formulario con los datos del usuario
 function fillFormWithUserData(user) {
    id_user_type = convertToInteger(user.id_user_type);
    document.getElementById('name').value = user.name || '';
    document.getElementById('middle_name').value = user.middle_name || '';
    document.getElementById('last_name').value = user.last_name || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone_number').value = user.phone_number || '';
    document.getElementById('username').value = user.username || '';
}

// Función para obtener la información del usuario y llenar el formulario
function fetchUserData() {
    const userId = getCookie('id_user');
    const url = new URL('http://localhost:3000/api/v1/consultar/usuario');
    url.searchParams.append('id', userId);

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
            throw new Error('Failed to fetch user data');
        }
    })
    .then(data => {
        if (data.status_code !== 200) {
            alert('Error al obtener los datos del usuario');
            return;
        }
        fillFormWithUserData(data.data[0]);
    })
    .catch(error => {
        alert('Error al obtener los datos del usuario');
        console.error('Error:', error);
    });
}


