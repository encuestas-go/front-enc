document.addEventListener("DOMContentLoaded", function() {
    let form = document.getElementById("commentForm");
  
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        let email = document.getElementById('inputMail');
        let pass = document.getElementById('inputPass');

        loginRequest(email.value, pass.value);
    }); 
});

function loginRequest(email, password) {
    fetch('http://localhost:3000/login', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
            email: email, 
            password: password
        })
    })
    .then(response => response.json()) 
    .then(data => {
        console.log(data);
        if (data.status_code && data.status_code != 200) {
            alert('Usuario o contraseña invalido');
            return;
        }
        
        setCookie('id_user', data.id_user, 1);
        setCookie('id_type_user', data.id_type_user);
        window.location.href = '../../HTML/index.html'
    }) 
    .catch(error => {
        console.error('Error:', error);
        // TODO: change to modal
        alert('Usuario o contraseña invalido');
    }); 

}