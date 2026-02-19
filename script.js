const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('send-location', { latitude, longitude });
    }, (error) => {
        console.error('Error getting location:', error);
    }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 

    }
);
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const marker = L.marker([0, 0]).addTo(map);

socket.on('update-location', (data) => {
    const {id, latitude, longitude } = data;
    
    map.setView([latitude, longitude]);
    if(marker) {
        marker.setLatLng([latitude, longitude]);
    }
    else {
        L.marker([latitude, longitude]).addTo(map);
    }
});
socket.on('disconnect', (id) => {
    if(marker[id]) {
        map.removeLayer(marker[id]);
        delete marker[id];
    }
}); 