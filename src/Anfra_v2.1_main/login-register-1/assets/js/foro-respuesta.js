document.addEventListener("DOMContentLoaded", function() {   
    
    fetchForumData();

    document.getElementById("commentForm").addEventListener("submit", function(event) {
        event.preventDefault();
        
        createAnswer();
    })
});

function createAnswer() {
    let url = new URL('http://localhost:3000/api/v1/publicar/respuestaForo');
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

        alert('Respuesta creada con éxito');
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
        "answer_text": getHTMLValue('pregunta'),
        "question_id": convertToInteger( getHTMLValue('category_event') )
    }
}

function fetchForumData() {
    let url = new URL('http://localhost:3000/api/v1/obtener/datosForo');
    url.searchParams.append('user_id', getCookie('id_user'));

    fetch(url, {
        method: 'GET', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
        },
        credentials: 'include' 
    })
    .then(response => {
        if (response.ok) {
            return response.json(); 
        } else {
            throw new Error('Failed to fetch data'); 
        }
    })
    .then(data => {
        if (data.status_code && data.status_code != 200) {
            alert('Error al obtener la información del foro');
            setTimeout(() => {}, 2000); 
            return;
        }

        if (!data.data || data.data.questions.length == 0) {
            alert('No hay preguntas en el foro');
            return;
        }

        const selectElement = document.getElementById('category_event');
        selectElement.innerHTML = '<option value="">Preguntas alumnos</option>'; // Limpiar y añadir opción predeterminada

        data.data.questions.forEach(question => {
            const optionElement = document.createElement('option');
            optionElement.value = question.id;
            optionElement.textContent = question.question_text;
            selectElement.appendChild(optionElement);
        });
    })
    .catch(error => {
        alert('Error al obtener la información del foro');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}
