$(document).ready(mapping);
$(document).ready(modeCheck);

/* This code is based on Tero Karvinen's reference implementation (https://terokarvinen.com/2018/save-checkbox-state-to-localstorage-javascript-and-jquery-example/) for the use of localStorage to preserve the state of a checkbox between pages and sessions. */
function modeCheck(){
  let checked="true"==localStorage.getItem("status");
  $("#lightordark").prop('checked', checked)
  $("#lightordark").click(modeSet);
}

function modeSet(){
  let checked=$("#lightordark").is(":checked");
  localStorage.setItem("status", checked);
}

// End Tero-based scripting

function mapping(){

  var light = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'lafishergis/ckvwum7mc30u214nxeoigeyr6',
    accessToken: 'sk.eyJ1IjoibGFmaXNoZXJnaXMiLCJhIjoiY2t2OXJ4dnV1YTY2ZjJwbnpjM3BxbWRnYiJ9.CW4oaT94TkbelBF0Fj4rJw',
    tileSize: 512,
    zoomOffset: -1,
  });

  var dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id:'lafishergis/ckvwv1qz354hp14s8pcasgvi8',
      accessToken: 'sk.eyJ1IjoibGFmaXNoZXJnaXMiLCJhIjoiY2t2OXJ4dnV1YTY2ZjJwbnpjM3BxbWRnYiJ9.CW4oaT94TkbelBF0Fj4rJw',
      tileSize: 512,
      zoomOffset: -1,
  });

  var map = L.map('map', {layers:[light]}).fitWorld();

  function onLocationFound(e) {
    var radius = e.accuracy; //this defines a variable radius as the accuracy value returned by the locate method. The unit is meters.

    L.marker(e.latlng).addTo(map)  //this adds a marker at the lat and long returned by the locate function.
        .bindPopup("You are within " + Math.round(radius * 3.28084) + " feet of this point").openPopup(); //this binds a popup to the marker. The text of the popup is defined here as well. Note that we multiply the radius by 3.28084 to convert the radius from meters to feet and that we use Math.round to round the conversion to the nearest whole number.

        if (radius <= 100) {
              L.circle(e.latlng, radius, {color: 'green'}).addTo(map);
          }
          else{
              L.circle(e.latlng, radius, {color: 'red'}).addTo(map);
          }

    var times = SunCalc.getTimes(new Date(), e.latitude, e.longitude);
    var sunrise = times.sunrise.getHours();
    var sunset = times.sunset.getHours();

    var currentTime = new Date().getHours();
        if (sunrise < currentTime && currentTime < sunset){
          map.removeLayer(dark);
          map.addLayer(light);
        }
        else {
          map.removeLayer(light);
          map.addLayer(dark);
        }
  }


  var baseMaps = {"Light Mode": light, "Dark Mode": dark};

  var myControl = L.control.layers(baseMaps).addTo(map);

  function geoLocate(){

      map.on('locationfound', onLocationFound); //this is the event listener

      function onLocationError(e) {
        alert(e.message);
      }

      map.on('locationerror', onLocationError);

      map.locate({setView: true, maxZoom: 16});
  }

  var geolocationButton = L.easyButton('<img src="Lab Assets/Lab 4 Assets/dot.png">', geoLocate);

  geolocationButton.addTo(map)

}
