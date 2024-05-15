var existData = false;

document.addEventListener("DOMContentLoaded", function() {
    fetchSurveyData();
    document.getElementById("commentForm").addEventListener("submit", function(event) {
        event.preventDefault();

        if (!existData) {
            createNewDemographicSurvey();
        }else{
            updateDemographicSurvey();
        }
    })
});

function createNewDemographicSurvey() {
    let url = new URL('http://localhost:3000/api/v1/crear/nivelDemografico');
    let survey = getDemographicData();
    
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
        location.reload(true); 
    })
    .catch(error => {
        alert('Error al crear encuesta');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}

function getDemographicData() {
    return{
        "user_id": convertToInteger( getCookie('id_user') ),
        "housing_type": getHTMLValue('inputhousingtype') ,
        "house_condition":getHTMLValue('housecondition')  ,
        "own_transport": convertToBoolean(getHTMLValue('owntransport')),
        "income_amount": convertToFloat( getHTMLValue('incomeamount') ),
        "working_members" : convertToInteger( getHTMLValue('workingmembers') ) ,
        "members_underage": convertToInteger( getHTMLValue('underage') ),
        "monthly_expenses": convertToFloat( getHTMLValue('monthlyexpenses') ),
        "goverment_support": convertToBoolean(getHTMLValue('govermentsupport'))
    }
}

function fillSurveyFormIfExist(userDetails) {
    document.getElementById('inputhousingtype').value = userDetails.housing_type;
    document.getElementById('housecondition').value = userDetails.house_condition;
    document.getElementById('owntransport').value = userDetails.own_transport.toString();
    console.log(userDetails);

    document.getElementById('incomeamount').value = userDetails.income_amount;
    document.getElementById('workingmembers').value = userDetails.working_members;
    document.getElementById('underage').value = userDetails.members_underage;
    console.log(userDetails);

    document.getElementById('monthlyexpenses').value = userDetails.monthly_expenses;
    document.getElementById('goverment_support').value = userDetails.goverment_support.toString();
}


function fetchSurveyData() {
    let url = new URL('http://localhost:3000/api/v1/consultar/nivelDemografico');
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
            alert('Error al obtener la informacion de la encuesta demográfica');
            setTimeout(() => {}, 2000); 
            return;
        }

        if (data.data && data.data.length == 0) {
            existData = false;
            return;
        }

        existData = true;
        changeButtonContent();

        const user = data.data[0];
        const userDetails = {
            id: user.id,
            user_id: user.user_id,
            housing_type: user.housing_type,
            house_condition:  user.house_condition,
            own_transport: user.own_transport,
            income_amount: user.income_amount,
            working_members : user.working_members,
            members_underage: user.members_underage,
            monthly_expenses: user.monthly_expenses,
            goverment_support: user.goverment_support
        };
        
        fillSurveyFormIfExist(userDetails);
    })
    .catch(error => {
        alert('Error al obtener la informacion de la encuesta demográfica');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}



function updateDemographicSurvey(){
    let url = new URL('http://localhost:3000/api/v1/actualizar/nivelDemografico');
    let survey = getDemographicData();
    
    if (!areAllValuesValid(survey)) {
        alert('Llena todos los campos de la encuesta');
        return;
    }

    fetch(url, {
        method: 'PUT', 
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
        if (data.status_code && data.status_code != 200) {
            alert('Error al actualizar la encuesta');
            setTimeout(() => {}, 2000); 
            return;
        }

        alert('Actualizado con exito');
        setTimeout(() => {}, 3000); 
        location.reload(true); 
    })
    .catch(error => {
        alert('Error al actualizar encuesta');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}
