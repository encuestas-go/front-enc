document.addEventListener("DOMContentLoaded", function() {
    let form = document.getElementById("commentForm1");
  
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        let name = document.getElementById('name');
        let middle_name = document.getElementById('mid_name');
        let last_name = document.getElementById('last_name');
        let email = document.getElementById('email');
        let phone_number = document.getElementById('phone');
        let username = document.getElementById('username');
        let password = document.getElementById('password');
        let typeuser = document.getElementById('type_user');

        let body = JSON.stringify({
            name: name.value,
            middle_name: middle_name.value,
            last_name: last_name.value,
            email: email.value, 
            phone_number: phone_number.value,
            username: username.value,
            password: password.value,
            id_user_type: parseInt(typeuser.value)
        })

        console.log(body)

        loginRequest(body);
    }); 
});

function loginRequest(bodyJSON) {
    fetch('http://localhost:3000/crear/usuario', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json', 
        },
        body: bodyJSON
    })
    .then(response => response.json()) 
    .then(data => {
        console.log(data);
        if (data.status_code && data.status_code != 201) {
            alert('Error al crear el usuario, verifica la información');
            return;
        }
        
        window.location.href = '../../HTML/index.html'
    }) 
    .catch(error => {
        console.error('Error:', error);
        // TODO: change to modal
        alert('Error al crear el usuario, verifica la información');
    }); 

}