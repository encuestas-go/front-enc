var existData = false;

document.addEventListener("DOMContentLoaded", function() {
    
    fetchSurveyData();

    document.getElementById("commentForm").addEventListener("submit", function(event) {
        event.preventDefault();

        if (existData) {
            updateHouseInfrastructureSurvey();
        } else {
            createHouseInfrastructureSurvey();
        }
    })
});


function createHouseInfrastructureSurvey() {
    let url = new URL('http://localhost:3000/api/v1/crear/InfraestructuraCasa');
    let survey = getHouseInfrastructureData()
    
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

        alert('creada con exito');
        setTimeout(() => {}, 3000); 
        location.reload(true); 
    })
    .catch(error => {
        alert('Error al crear encuesta');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}


function getHouseInfrastructureData() {
    const idsEquipment = ['tv', 'fridge', 'washer', 'airconditioning'];
    const selectedEquipment = idsEquipment.filter(id => {
        const element = document.getElementById(id);
        return element && element.checked; 
    }).map(id => {
        const label = document.querySelector(`label[for="${id}"]`);
        return label ? label.textContent : ''; 
    }).join(',');

    const idsServices = ['electricity', 'water', 'gas', 'calefaction'];
    const selectedServices = idsServices.filter(id => {
        const element = document.getElementById(id);
        return element && element.checked; 
    }).map(id => {
        const label = document.querySelector(`label[for="${id}"]`);
        return label ? label.textContent : ''; 
    }).join(',');


    //Belongs to other_properties, remove in case that is not correct
    const PointTrue = document.getElementById('true');
    const PointFalse = document.getElementById('false');
    let PointSelected = null;

    if (PointTrue.checked) {
        PointSelected = true;
    } else if (PointFalse.checked) {
        PointSelected = false;
    }

    if (PointSelected === null) {
        alert("Please select an option: Yes or No");
        return null; 
    }

    return{
        "user_id" : convertToInteger( getCookie('id_user') ),
        "zone" : getHTMLValue('lifezone') ,
        "permanence": getHTMLValue('permanency')  ,
        "infraestructure_status": getHTMLValue('statehome'),
        "floor_type": getHTMLValue('statefloor') ,
        "roof_type": getHTMLValue('stateroof') ,
        "wall_type":  getHTMLValue('statewall') ,
        "total_members": convertToInteger( getHTMLValue('familynum') ) ,
        "total_rooms": convertToInteger( getHTMLValue('roomnum') ),
        "household_equipment": selectedEquipment ,
        "basic_services": selectedServices ,
        "other_properties": PointSelected
    }
}

function fillSurveyFormIfExist(userDetails) {
    document.getElementById('lifezone').value = userDetails.zone;
    document.getElementById('permanency').value = userDetails.permanence;
    document.getElementById('statehome').value = userDetails.infraestructure_status;
    document.getElementById('statefloor').value = userDetails.floor_type;
    document.getElementById('stateroof').value = userDetails.roof_type;
    document.getElementById('statewall').value = userDetails.wall_type;
    document.getElementById('familynum').value = userDetails.total_members;
    document.getElementById('roomnum').value = userDetails.total_rooms;

    const checkboxEquipment = {
        'Televisión': 'tv',
        'Refrigerador': 'fridge',
        'Lavadora': 'washer',
        'Ventilador': 'airconditioning',
    };

    if (userDetails.household_equipment) {
        const equipmentArray = userDetails.household_equipment.split(',');
        equipmentArray.forEach(equipment => {
            const trimmedEquipment = equipment.trim();
            if (checkboxEquipment[trimmedEquipment]) {
                const checkboxId = checkboxEquipment[trimmedEquipment];
                const checkboxElement = document.getElementById(checkboxId);
                if (checkboxElement) {
                    checkboxElement.checked = true;
                }
            }
        });
    }

    const checkboxServices = {
        'Electricidad': 'electricity',
        'Agua': 'water',
        'Gas': 'gas',
        'Calefacción': 'calefaction',
    };

    if (userDetails.basic_services) {
        const servicesArray = userDetails.basic_services.split(',');
        servicesArray.forEach(service => {
            const trimmedServices = service.trim();
            if (checkboxServices[trimmedServices]) {
                const checkboxID = checkboxServices[trimmedServices];
                const checkboxElement= document.getElementById(checkboxID);
                if (checkboxElement) {
                    checkboxElement.checked = true;
                }
            }
        });
    }


    if (userDetails.other_properties) {
        document.querySelector('input[name="publicpoint"][value="Si"]').checked = true;
    } else {
        document.querySelector('input[name="publicpoint"][value="No"]').checked = true;
    }

}

function fetchSurveyData() {
    let url = new URL('http://localhost:3000/api/v1/consultar/InfraestructuraCasa');
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
            alert('Error al obtener la informacion de la encuesta');
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
            user_id : user.id_user,
            zone : user.zone,
            permanence: user.permanence ,
            infraestructure_status: user.infraestructure_status ,
            floor_type: user.floor_type,
            roof_type: user.roof_type,
            wall_type:  user.wall_type,
            total_members: user.total_members ,
            total_rooms: user.total_rooms,
            household_equipment: user.household_equipment,
            basic_services: user.basic_services,
            other_properties: user.other_properties
        };
    
        fillSurveyFormIfExist(userDetails);
    })
    .catch(error => {
        alert('Error al obtener la informacion de la encuesta');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}


function updateHouseInfrastructureSurvey() {
    let url = new URL('http://localhost:3000/api/v1/actualizar/InfraestructuraCasa');
    let survey = getHouseInfrastructureData();

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
            throw new Error('Failed to update data'); 
        }
    })
    .then(data => {
        if (data.status_code && data.status_code != 200) {
            alert('Error al actualizar la encuesta');
            setTimeout(() => {}, 2000); 
            return;
        }

        alert('actualizado con exito');
        setTimeout(() => {}, 3000); 
        location.reload(true); 
    })
    .catch(error => {
        alert('Error al actualizar encuesta');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}