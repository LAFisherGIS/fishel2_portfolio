mapboxgl.accessToken = 'pk.eyJ1IjoibGFmaXNoZXJnaXMiLCJhIjoiY2t5MHp1NHNoMDY3dDJ3cGRtNXdraDFiaSJ9.GS7A10SiyfuUiKee_X5N_A'
const map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/dark-v10',
  center: [-122.4443, 47.2529], // starting position
  zoom: 10 // starting zoom
});

map.on('load', function() {
  map.addLayer({
    id: 'hospitals',
    type: 'symbol',
    source: {
      type: 'geojson',
      data: hospitalPoints
    },
    layout: {
      'icon-image': 'hospital-15',
      'icon-allow-overlap': true
    },
    paint: { }
  });
  map.addLayer({
    id: 'libraries',
    type: 'symbol',
    source: {
      type: 'geojson',
      data: libraryPoints
    },
    layout: {
      'icon-image': 'library-15',
      'icon-allow-overlap': true
    },
    paint: { }
  });

  map.addSource('nearest-hospital', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
      ]
    }
  });

});

var popup = new mapboxgl.Popup();

map.on('click', 'hospitals', function(e) {

  var feature = e.features[0];

  popup.setLngLat(feature.geometry.coordinates)
    .setHTML('<b>Hospital Name: </b>' + feature.properties.NAME + '<br><b>Address: </b>' + feature.properties.ADDRESS)
    .addTo(map);
});

map.on('click', 'libraries', function(f) {
  // Using Turf, find the nearest hospital to library clicked
  var refLibrary = f.features[0];
  var nearestHospital = turf.nearest(refLibrary, hospitalPoints);
    // Update the 'nearest-hospital' data source to include the nearest library
  map.getSource('nearest-hospital').setData({
    type: 'FeatureCollection',
    features: [
      nearestHospital
    ]
  });

  // Create a new circle layer from the 'nearest-hospital' data source
  map.addLayer({
    id: 'nearestHospitalLayer',
    type: 'circle',
    source: 'nearest-hospital',
    paint: {
      'circle-radius': 12,
      'circle-color': '#486DE0'
    }
  }, 'hospitals');

  let from = refLibrary;
  let to = nearestHospital;

  let options = {units: 'miles'};

  var distance = turf.distance(from, to, options);

  popup.setLngLat(refLibrary.geometry.coordinates)
    .setHTML('<b>' + refLibrary.properties.NAME + '</b><br>The nearest hospital is ' + nearestHospital.properties.NAME + ', located at ' + nearestHospital.properties.ADDRESS + ', which is ' + distance.toFixed(2) + ' miles away.')
    .addTo(map);

});

const navControl = new mapboxgl.NavigationControl({
  showCompass: false,
});
map.addControl(navControl, 'top-right');
