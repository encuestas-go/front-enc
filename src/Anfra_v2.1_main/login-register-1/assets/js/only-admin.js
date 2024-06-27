document.addEventListener("DOMContentLoaded", function() {
    let user = convertToInteger(getCookie('id_type_user'));
    if (user == 2) {
        alert('Debes ser administrador para poder acceder aquí');
        setTimeout(() => {}, 2000); 
        window.location.href = '../../html/index.html';
    }
});