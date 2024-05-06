
document.addEventListener("DOMContentLoaded", function() {
    (function FillUserData() {
        const url = new URL('http://localhost:3000/api/v1/consultar/usuario');
        url.searchParams.append('user_id', getCookie('id_user'));

        console.log("a", getCookie('id_user'));

        fetch(url, {
            method: 'GET', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
            },
            credentials: 'include'
        })
        .then(response => response.json()) 
        .then(data => {
            console.log(data);
            if (data.status_code && data.status_code != 200) {
                alert('Error al crear el usuario, verifica la información');
                return;
            }
            
            // window.location.href = '../../HTML/index.html'
        }) 
        .catch(error => {
            console.error('Error:', error);
            // TODO: change to modal
            alert('Error al crear el usuario, verifica la información');
        }); 
    })()

});



/*
document.addEventListener("DOMContentLoaded", function() {
    (function FillUserData() {
        const url = new URL('http://localhost:3000/api/v1/consultar/usuario');
        url.searchParams.append('user_id', getCookie('id_user'));

        console.log("User ID from Cookie:", getCookie('id_user'));

        axios.get(url.toString(), {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
        .then(function (response) {
            console.log(response.data);
            if (response.data.status_code && response.data.status_code !== 200) {
                alert('Error al crear el usuario, verifica la información');
                return;
            }
            // You can redirect or update UI here
            // window.location.href = '../../HTML/index.html'
        })
        .catch(function (error) {
            console.error('Error:', error);
            // Replace this alert with a modal or proper error handling in your production code
            alert('Error al consultar los datos del usuario, verifica la información');
        });
    })();
});
*/