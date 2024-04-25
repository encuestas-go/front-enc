/* eslint-disable prettier/prettier */
let user_id = getCookie('id_user');

console.log('Hola: ' + user_id)

if (!user_id){
    console.log('No hay usuario')
    window.location.href = 'index.html';
}