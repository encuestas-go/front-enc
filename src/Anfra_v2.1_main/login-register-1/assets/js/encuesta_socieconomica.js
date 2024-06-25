var existData = false;
let map, marker, infowindow, autocomplete;
hideDeleteButton();

document.addEventListener("DOMContentLoaded", function() {

    fetchSurveyData();

    document.getElementById("button-delete").addEventListener("click", function(event) {
        event.preventDefault();
        deleteSocioeconomicSurvey();
    });

    document.getElementById("commentForm").addEventListener("submit", function(event) {
        event.preventDefault();

        if (existData) {
            updateSocioeconomicSurvey();
        } else {
            createNewSocioeconomicSurvey();
        }
    })
});

function fetchSurveyData() {
    let url = new URL('http://localhost:3000/api/v1/consultar/nivelSocioeconomico');
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
        showDeleteButton();

        const user = data.data[0];
        const userDetails = {
            id: user.id,
            id_user: user.id_user,
            full_name: user.full_name,
            birth_date: user.birth_date,
            nationality: user.nationality,
            age: user.age,
            degree_aspired: user.degree_aspired,
            gender: user.gender,
            language: user.language,
            last_degree_father: user.last_degree_father,
            last_degree_mother: user.last_degree_mother,
            marital_status: user.marital_status,
            longitude: user.longitude,
            latitude: user.latitude,
            residence_address: user.residence_address,
            socioeconomic_status: user.socioeconomic_status,
            state: user.state
        };
    
        fillSurveyFormIfExist(userDetails);
    })
    .catch(error => {
        alert('Error al obtener la informacion de la encuesta');
        setTimeout(() => {}, 2000); 
        console.error('Error:', error); 
    });
}

function fillSurveyFormIfExist(userDetails) {
    document.getElementById('inputfullname').value = userDetails.full_name;
    document.getElementById('nationality').value = userDetails.nationality;
    document.getElementById('inputidioma').value = userDetails.language;

    const birthDate = new Date(userDetails.birth_date);
    document.getElementById('inputday').value = birthDate.getDate();
    document.getElementById('inputmonth').value = String(birthDate.getMonth() + 1).padStart(2, '0');
    document.getElementById('inputyear').value = birthDate.getFullYear();

    document.getElementById('inputsex').value = userDetails.gender;
    document.getElementById('inputcivil').value = userDetails.marital_status;
    document.getElementById('inputsocioeconomico').value = userDetails.socioeconomic_status;
    document.getElementById('inputedu').value = userDetails.degree_aspired;
    document.getElementById('inputestpadre').value = userDetails.last_degree_father;
    document.getElementById('inputestmadre').value = userDetails.last_degree_mother;
    document.getElementById('inputage').value = userDetails.age;

    updateMap(userDetails.latitude, userDetails.longitude, userDetails.residence_address);
}

function updateMap(lat, lng, address) {
    if (!map) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: lat, lng: lng },
            zoom: 17  // Zoom más cercano
        });
    } else {
        map.setCenter({ lat: lat, lng: lng });
        map.setZoom(17);  // Zoom más cercano
    }

    if (marker) {
        marker.setMap(null);
    }

    marker = new google.maps.Marker({
        map: map,
        position: { lat: lat, lng: lng },
        visible: true
    });

    if (infowindow) {
        infowindow.close();
    }

    infowindow = new google.maps.InfoWindow({
        content: '<div><strong>Dirección:</strong><br>' + address + '</div>'
    });

    infowindow.open(map, marker);

    document.getElementById('address').value = address;
}

function createNewSocioeconomicSurvey() {
    let url = new URL('http://localhost:3000/api/v1/crear/nivelSocioeconomico');
    let survey = getSocieconomicData();
    
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

function getSocieconomicData() {
    const day = getHTMLValue('inputday');
    const month = getHTMLValue('inputmonth');
    const year = getHTMLValue('inputyear');

    return {
        "id_user": convertToInteger( getCookie('id_user') ),
        "full_name": getHTMLValue('inputfullname'),
        "birth_date": `${year}/${month}/${day}`,
        "nationality": getHTMLValue('nationality'),
        "gender": getHTMLValue('inputsex'),
        "age": convertToInteger( getHTMLValue('inputage') ),
        "marital_status": getHTMLValue('inputcivil'),
        "longitude": window.selectedLng,
        "latitude": window.selectedLat,
        "residence_address": window.selectedAdd,
        "socioeconomic_status": getHTMLValue('inputsocioeconomico'),
        "language": getHTMLValue('inputidioma'),
        "degree_aspired": getHTMLValue('inputedu'),
        "last_degree_father": getHTMLValue('inputestpadre'),
        "last_degree_mother": getHTMLValue('inputestmadre')
    }
}

function updateSocioeconomicSurvey() {
    let url = new URL('http://localhost:3000/api/v1/actualizar/nivelSocioeconomico');
    let survey = getSocieconomicData();

    if (!areAllValuesValid(survey)) {
        alert('Llena todos los valor en la encuesta');
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

        // TODO: Modal with timer: event.preventDefault();
        // min char not required
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


function deleteSocioeconomicSurvey() {
    let url = new URL('http://localhost:3000/api/v1/eliminar/nivelSocioeconomico');
    url.searchParams.append('user_id', getCookie('id_user'));
    
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

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
    });

    input = document.getElementById('address');
    autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo('bounds', map);

    infowindow = new google.maps.InfoWindow();
    marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // Si el lugar tiene geometría, entonces centramos el mapa en el lugar
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Zoom más cercano
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);

        // Guardamos la latitud y longitud en variables globales para usarlas al guardar el formulario
        window.selectedLat = place.geometry.location.lat();
        window.selectedLng = place.geometry.location.lng();
        window.selectedAdd = place.formatted_address;

        // Actualizamos el campo de dirección
        document.getElementById('address').value = place.formatted_address;
    });
}

window.onload = initMap;