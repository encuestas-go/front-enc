document.addEventListener("DOMContentLoaded", function() {
    let form = document.getElementById("commentForm");
  
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        console.log("hola");

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
        }),
        credentials: 'include' // Asegúrate de incluir esto para recibir cookies
    })
    .then(response => response.json()) 
    .then(data => {
        console.log(data);
        if (data.status_code && data.status_code != 200) {
            alert('Usuario o contraseña invalido');
            return;
        }
        
        window.location.href = '../../html/index.html'
    }) 
    .catch(error => {
        console.error('Error:', error);
        // TODO: change to modal
        alert('Usuario o contraseña invalido');
    }); 

}
