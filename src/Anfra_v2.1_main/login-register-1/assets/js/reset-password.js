document.addEventListener("DOMContentLoaded", function() {
    let form = document.getElementById("commentForm");
  
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        let email = document.getElementById('inputMail').value;

        resetPasswordRequest(email);
    }); 
});


function resetPasswordRequest(email) {
    const url = new URL('http://localhost:3000/login/reset-password');
    url.searchParams.append('email', email);

    fetch(url, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json', 
        }
    })
    .then(response => response.json()) 
    .then(data => {
        if (data.status_code && data.status_code != 200) {
            alert('Hubo un error en el email');
            return;
        }
        
        window.location.href = 'complete-reset-password.html';
    }) 
    .catch(error => {
        console.error('Error:', error);
        // TODO: change to modal
        alert('Hubo un error intentando obtener la contraseña de ');
    }); 
}