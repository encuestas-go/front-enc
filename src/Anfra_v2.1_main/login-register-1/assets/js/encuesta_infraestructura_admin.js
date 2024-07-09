const select = document.getElementById('inputjobsituation');

document.addEventListener("DOMContentLoaded", function() {
    fetchUsers();

    document.getElementById("btn-obtener").addEventListener("click", function(event) {
        event.preventDefault();
        fetchSurveyData();
    });


    
    document.getElementById("button-delete").addEventListener("click", function(event) {
        event.preventDefault();
        deleteHouseInfrastructureSurvey();
    });
    
});


function fetchUsers() {
    const url = new URL('http://localhost:3000/api/v1/consultar/usuario');
    url.searchParams.append('only_students', 'true');

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
            throw new Error('Failed to fetch users');
        }
    })
    .then(data => {
        if (data.status_code !== 200) {
            alert('Error al obtener los usuarios');
            return;
        }
        const users = data.data;
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.name} ${user.middle_name || ''} ${user.last_name}`;
            select.appendChild(option);
        });
    })
    .catch(error => {
        alert('Error al obtener los usuarios');
        console.error('Error:', error);
    });
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
    url.searchParams.append('user_id', select.value);

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


function deleteHouseInfrastructureSurvey() {
    let url = new URL('http://localhost:3000/api/v1/eliminar/InfraestructuraCasa');
    url.searchParams.append('user_id', select.value);
    
    fetch(url, {
        method: 'DELETE', 
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
            throw new Error('Failed to create data'); 
        }
    })
    .then(data => {
        if (data.status_code && data.status_code != 200) {
            alert('Error al eliminar la encuesta');
            setTimeout(() => {}, 2000); 
            return;
        }

        alert('Eliminado con exito');
        setTimeout(() => {}, 3000); 
        location.reload(true); 
    })
    .catch(error => {
        alert('Error al eliminar encuesta');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}