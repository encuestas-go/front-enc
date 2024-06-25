document.addEventListener("DOMContentLoaded", function() {
    const select = document.getElementById('inputjobsituation');
    const submitBtn = document.getElementById('submitBtn');

    // Función para llenar el select con los usuarios
    function fetchUsers() {
        const url = new URL('http://localhost:3000/api/v1/consultar/usuario');

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

    // Función para eliminar el usuario seleccionado
    function deleteUser(userId) {
        const url = new URL(`http://localhost:3000/api/v1/eliminar/usuario`);
        url.searchParams.append('user_id', userId);

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
                throw new Error('Failed to delete user');
            }
        })
        .then(data => {
            alert('Usuario eliminado con éxito');
            // Eliminar la opción del select
            const optionToDelete = select.querySelector(`option[value="${userId}"]`);
            if (optionToDelete) {
                select.removeChild(optionToDelete);
            }
        })
        .catch(error => {
            alert('Error al eliminar el usuario');
            console.error('Error:', error);
        });
    }

    // Manejar el submit del formulario
    document.getElementById('commentForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const selectedUserId = select.value;
        if (selectedUserId) {
            deleteUser(selectedUserId);
        } else {
            alert('Por favor, selecciona un usuario para eliminar.');
        }
    });

    // Llenar el select con los usuarios al cargar la página
    fetchUsers();
});
