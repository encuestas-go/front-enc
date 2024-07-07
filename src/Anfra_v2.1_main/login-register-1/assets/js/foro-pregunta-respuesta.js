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

        // Poblar el contenedor de preguntas y respuestas
        const questionsContainer = document.getElementById('questions-container');
        questionsContainer.innerHTML = ''; // Limpiar el contenedor

        data.data.questions.forEach(question => {
            const questionElement = document.createElement('div');
            questionElement.className = 'question';

            const questionTitle = document.createElement('h3');
            questionTitle.className = 'question-title';
            questionTitle.textContent = question.question_text;

            questionElement.appendChild(questionTitle);

            // Crear lista de respuestas si existen
            if (question.answers && question.answers.length > 0) {
                const answersList = document.createElement('div');
                answersList.className = 'answers-list';

                question.answers.forEach(answer => {
                    const answerElement = document.createElement('div');
                    answerElement.className = 'answer';

                    const answerContent = document.createElement('p');
                    answerContent.textContent = answer.answer_text;

                    answerElement.appendChild(answerContent);
                    answersList.appendChild(answerElement);
                });

                questionElement.appendChild(answersList);
            }

            questionsContainer.appendChild(questionElement);
        });
    })
    .catch(error => {
        alert('Error al obtener la información del foro');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}

document.addEventListener("DOMContentLoaded", function() {
    fetchForumData();
});