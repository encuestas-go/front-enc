document.addEventListener("DOMContentLoaded", function() {
    let user = convertToInteger(getCookie('id_type_user'));
    if (user != 3) {
        alert('Debes ser encuestador para poder acceder aquí');
        setTimeout(() => {}, 2000); 
        window.location.href = '../../html/index.html';
    }
});