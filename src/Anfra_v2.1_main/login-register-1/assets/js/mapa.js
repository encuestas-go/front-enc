document.getElementById('geocode-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var address = document.getElementById('address').value;

    fetch('https://maps.googleapis.com/maps/api/geocode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ 'address': address })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            var lat = data.lat;
            var lng = data.lng;
            initMap(lat, lng);
        }
    })
    .catch(error => console.error('Error:', error));
});

function initMap(lat, lng) {
    var location = { lat: lat, lng: lng };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: location
    });
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
}