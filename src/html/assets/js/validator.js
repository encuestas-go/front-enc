(function () {
    let user_id = getCookie('id_user');

    if (!user_id){
        console.log('No hay usuario')
        window.location.href = '../Anfra_v2.1_main/login-register-1/index.html';
    }
})()
