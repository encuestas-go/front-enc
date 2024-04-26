document.addEventListener('DOMContentLoaded', function() {
    var closeButton = document.getElementById('close_session');

    closeButton.addEventListener('click', function() {
        deleteCookie(idUserCookieName);
        deleteCookie(idTypeUserCookieName);
    });
});
