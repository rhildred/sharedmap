import "https://cdnjs.cloudflare.com/ajax/libs/framework7/5.7.12/js/framework7.bundle.min.js";


//initialize framework 7
var myApp = new Framework7();

// If your using custom DOM library, then save it to $$ variable
var $$ = Dom7;

// Add the view
myApp.view.create('.view-main', {

    // enable the dynamic navbar for this view:
    dynamicNavbar: true
});


// initialize map

const myMap = L.map('mapid', {
    center: [37.7749, -122.4194],
    zoom: 13
});


let osmTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
let attribution = '© OpenStreetMap contributors';

// Create the basemap and add it to the map
L.tileLayer(osmTiles, {
    maxZoom: 18,
    attribution: attribution
}).addTo(myMap);

window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((oPosition) => {
            myMap.setView([oPosition.coords.latitude, oPosition.coords.longitude], 12);
        });
    }
});

myMap.on("contextmenu", (evt) => {
    //alert(`latitude: ${evt.latlng.lat}, longitude: ${evt.latlng.lng}`);
    $$("#lat").html(evt.latlng.lat);
    $$("#lng").html(evt.latlng.lng);
    myApp.sheet.open(".my-sheet", true);

});

// initialize firebase

import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-app.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-database.js"


// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "Your api key",
    authDomain: "domain",
    databaseURL: "url",
    projectId: "project id",
    storageBucket: "bucket",
    messagingSenderId: "sender id",
    appId: "app id"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);



//<!-- TODO: Add SDKs for Firebase products that you want to use
//     https://firebase.google.com/docs/web/setup#available-libraries -->

$$(".my-sheet").on("submit", (evt) => {
    evt.preventDefault();
    const waypointID = new Date().toISOString().replace(".", "_");
    const oNote = $$("#theNote");
    // evt is a closure
    firebase.database().ref('waypoints/' + waypointID).set({
        lat: $$("#lat").html(),
        lng: $$("#lng").html(),
        note: oNote.val()
    }).then(() => {
        oNote.val("");
        myApp.sheet.close(".my-sheet", true);
    }).catch(e => {
        console.log(e.toString());
    });
});

firebase.database().ref('waypoints/').on("value", snapshot => {
    let oWaypoints = snapshot.val();
    console.log(oWaypoints);
    Object.keys(oWaypoints).map((key) => {
        let oWaypoint = oWaypoints[key];
        let marker = L.marker([oWaypoint.lat, oWaypoint.lng]).addTo(myMap);
        marker.bindPopup(oWaypoint.note).openPopup();
    });
});

