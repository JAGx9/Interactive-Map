// Create Map
const myMap = {
    coordinates: [],
    businesses: [],
    map: {},
    markers: {},


    //leaflet map
    buildMap() {
        this.map = L.map('map', {
            center: this.coordinates,
            zoom: 15,
        });
        // Add OpenStreetMap tiles:
      
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(this.map)

        // add user marker
        const marker = L.marker(this.coordinates)
        marker
        .addTo(this.map)
        .bindPopup('<p1><b>You are here</b></p1>')
        .openPopup()
    },

    //add business markers
    addMarkers() {
        for (var i = 0; i < this.businesses.length; i++) {
        this.markers = L.marker([
                this.businesses[i].lat,
                this.businesses[i].long,
        ])
                .bindPopup(`<p1>${this.businesses[i].name}</p1>`)
                .addTo(this.map)
        }
    },
}



// Get coordinates                                                                                         
async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}

//Get businesses from foursquare
async function getFoursquare(business){
    const options = {
        method: 'GET', 
        headers: {
            Accept: 
            'application/json',
            Authorization: 'fsq3v+pNY/wjmjs/J050S6qlcfxYFh+ljbVCeIA1S8EKLD8='
        }
    };
let lat = myMap.coordinates[0]
let lon = myMap.coordinates[1]
let response = await fetch (`https://api.foursquare.com/v3/places/search?&query=${business}&ll=${lat}%2C${lon}`, options)
let data = await response.text()
let parsedData = JSON.parse(data)
let businesses = parsedData.results
return businesses
}
 
//foursquare array
function processBusinesses(data) {
    let businesses = data.map((element) => {
        let location = {
            name: element.name,
            lat: element.geocodes.main.latitude,
            long: element.geocodes.main.longitude
        };
        return location
    })
    return businesses
}

//button event listener
document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault()
    let business = document.getElementById('business').value 
    let data = await getFoursquare(business)
    myMap.businesses = processBusinesses(data)
    myMap.addMarkers()
})

// on load
window.onload = async () => {
	const coords = await getCoords()
	myMap.coordinates = coords
	myMap.buildMap()
}