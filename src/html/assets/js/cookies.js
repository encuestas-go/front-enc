const idUserCookieName = 'id_user';
const idTypeUserCookieName = 'id_type_user';

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(name) {
  let cookieArray = document.cookie.split(';'); // Divide la cadena de cookies en un array
  for(let i = 0; i < cookieArray.length; i++) {
      let cookiePair = cookieArray[i].split('='); // Divide cada par nombre=valor
      if(name == cookiePair[0].trim()) { // Elimina espacio en blanco y compara el nombre
          return decodeURIComponent(cookiePair[1]); // Decodifica y retorna el valor de la cookie
      }
  }
  return null; // Retorna null si no se encuentra la cookie
}

function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
