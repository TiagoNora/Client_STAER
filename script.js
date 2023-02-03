let h2 = document.querySelector('h2');
var map;
var icao24, callsign, longitude, latitude, squawk;
var marker;
var lat = 41.242165698;
var long = -8.675497298;
var tempoPesquisa = 5000;
var tempoApagar = 4800;

var icaoQuery;

var btn = document.getElementById("btn");

btn.addEventListener('click', event => {
    obterDadosTempo();
});

var LeafIcon = L.Icon.extend({
    options: {
        iconSize:     [30, 90],
        shadowSize:   [50, 64],
        iconAnchor:   [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor:  [-3, -76]
    }
});

var aviao = new LeafIcon({iconUrl: 'aviao.png'});

L.icon = function (options) {
    return new L.Icon(options);
};

function carregarMapa(){
    map = L.map('mapid').setView([lat, long], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    var terminator = L.terminator().addTo(map);
    setInterval(function() {
	    terminator.setTime();
    }, 60000); // Every minute
}

function obterDadosTempo(){
    obterDados();
    setInterval(obterDados,tempoPesquisa);
}


function obterDados(){
    icaoQuery = document.getElementById('icao').value;
    //var link = "http://127.0.0.1:5000/airplane/" + icaoQuery;
    var link = "http://192.168.1.220:3000/airplane/" + icaoQuery;
    console.log(link);
    fetch(link)
    .then((response) => response.json())
    .then((data) => {
        icao24 = data.icao;
        callsign = data.callsign;
        longitude = data.longitude;
        latitude = data.latitude;
        squawk = data.squawk;
        desenharAviaoNoMapa();


        
        setTimeout(function() {
            apagarAviaoNoMapa();
          }, tempoApagar);
        
    });


function desenharAviaoNoMapa(){
    console.log(latitude);
    console.log(longitude);
    var texto = "ICAO24: " + icao24 + "<br> CallSign:" + callsign + "<br> Longitude:" + longitude + "<br> Latitude:" + latitude + "<br> Squawk:" + squawk;
    marker = L.marker([latitude, longitude], {icon: aviao}).addTo(map)
        .bindPopup(texto)
        .openPopup();
    map.setView([latitude, longitude], 13);
  
}

function apagarAviaoNoMapa(){
    map.removeLayer(marker);
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

}
