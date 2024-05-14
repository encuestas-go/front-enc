
document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("commentForm").addEventListener("submit", function(event) {
        event.preventDefault();
        createNewEconomicSurvey();
    })
});


function createNewEconomicSurvey() {
    let url = new URL('http://localhost:3000/api/v1/crear/nivelEconomico');
    let survey = getEconomicData();
    console.log(survey)
    
    if (!areAllValuesValid(survey)) {
        alert('Llena todos los valor en la encuesta');
        return;
    }

    fetch(url, {
        method: 'POST', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(survey),
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

        alert('Encuesta creada con éxito');
        setTimeout(() => {}, 3000); 
        //location.reload(true); 
    })
    .catch(error => {
        alert('Error al crear encuesta');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}

function getEconomicData() {
    const ids = ['PTU', 'IMSS/ISSSTEIMSS/ISSSTE', 'SAR', 'SegPriv', 'SegPub']; 
    const selected = ids.filter(id => document.getElementById(id).checked) .map(id => document.querySelector(`label[for="${id}"]`).textContent); 
    const selectedValues = selected.join(','); 

    return{
        "id_user": convertToInteger( getCookie('id_user') ),
        "current_status": getHTMLValue('inputjobsituation'),
        "job_title": getHTMLValue('inputjobtitle') ,
        "employer_establishment": getHTMLValue('inputplacejob') ,
        "employment_type": getHTMLValue('inputtypejob'),
        "salary": convertToInteger( getHTMLValue('inputsalary') ) ,
        "amount_type": getHTMLValue('inputtypesalary') ,
        "work_benefits_type": selectedValues,
    }
}
