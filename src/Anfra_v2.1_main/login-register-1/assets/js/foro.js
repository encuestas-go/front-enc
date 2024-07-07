document.addEventListener("DOMContentLoaded", function() {    
    document.getElementById("commentForm").addEventListener("submit", function(event) {
        event.preventDefault();
        
        createAnswer();
    })
});

function createAnswer() {
    let url = new URL('http://localhost:3000/api/v1/publicar/preguntaForo');
    let data = getDataAnswer();
    
    if (!areAllValuesValid(data)) {
        alert('Llena todos los valor en la encuesta');
        return;
    }

    fetch(url, {
        method: 'POST', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(data),
        credentials: 'include' 
    })
    .then(response => {
        if (response.ok) {
            return response.json(); 
        } else {
            throw new Error('Failed to create data'); 
        }
    })
    .then(data => {
        if (data.status_code && data.status_code != 201) {
            alert('Error al crear la  encuesta');
            setTimeout(() => {}, 2000); 
            return;
        }

        alert('Pregunta creada con éxito');
        setTimeout(() => {}, 3000); 
        location.reload(true); 
    })
    .catch(error => {
        alert('Error al crear Pregunta');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}

function getDataAnswer(data) {
    return {
        "id_user":  convertToInteger( getCookie('id_user') ),
        "name": getHTMLValue('nombre'),
        "question_text": getHTMLValue('pregunta')
    }
}