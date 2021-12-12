$(document).ready(modeCheck);
$(document).ready(mapping);

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
  var map = L.map('map', {
    maxBounds : [[47.42692809746929, -122.85538888556895], [46.61560176506292, -121.11561841555328]],
    minZoom : 10
  }).setView([47.25, -122.44], 11);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Geocoding by &copy; <a href="https://github.com/komoot/photon" target="_null">Photon</a>, Routing by © <a href="https://www.mapbox.com/" target="_null">Mapbox</a>, Map data &copy; <a href="https://www.openstreetmap.org/" target="_null">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_null">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/" target="_null">Mapbox</a>',
      maxZoom: 18,
      id: 'lafishergis/ckvwv1qz354hp14s8pcasgvi8',
      accessToken: 'sk.eyJ1IjoibGFmaXNoZXJnaXMiLCJhIjoiY2t2OXJ4dnV1YTY2ZjJwbnpjM3BxbWRnYiJ9.CW4oaT94TkbelBF0Fj4rJw',
  }).addTo(map);

  var control = L.Routing.control({
      waypoints: [
        null
        //L.latLng(47.246587, -122.438830),
        //L.latLng(47.258024, -122.444725),
        //L.latLng(47.318017, -122.542970)
      ],
      routeWhileDragging: true,
      router: L.Routing.mapbox('sk.eyJ1IjoibGFmaXNoZXJnaXMiLCJhIjoiY2t2OXJ4dnV1YTY2ZjJwbnpjM3BxbWRnYiJ9.CW4oaT94TkbelBF0Fj4rJw'),
      units:'imperial',
      collapsible: true,
      show: false,
      geocoder: L.Control.Geocoder.photon('sk.eyJ1IjoibGFmaXNoZXJnaXMiLCJhIjoiY2t2OXJ4dnV1YTY2ZjJwbnpjM3BxbWRnYiJ9.CW4oaT94TkbelBF0Fj4rJw'),
  }).addTo(map);

  function createButton(label, container) {
      var btn = L.DomUtil.create('button', '', container);
      btn.setAttribute('type', 'button');
      btn.innerHTML = label;
      return btn;
  }

  map.on('click', function(e) {
      var container = L.DomUtil.create('div'),
      startBtn = createButton('Start from this location', container),
      destBtn = createButton('Go to this location', container);

      L.popup()
        .setContent(container)
        .setLatLng(e.latlng)
      .openOn(map);

      L.DomEvent.on(startBtn, 'click', function() {
        control.spliceWaypoints(0, 1, e.latlng);
        map.closePopup();
      });

      L.DomEvent.on(destBtn, 'click', function() {
        control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
        control.show();
        map.closePopup();
      });

  });
}
