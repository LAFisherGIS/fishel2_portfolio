mapboxgl.accessToken = 'pk.eyJ1IjoibGFmaXNoZXJnaXMiLCJhIjoiY2t5MHp1NHNoMDY3dDJ3cGRtNXdraDFiaSJ9.GS7A10SiyfuUiKee_X5N_A'

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/satellite-v9', // style URL
  center: [-103.2502, 29.2498], // starting position [lng, lat]
  zoom: 9, // starting zoom
  pitch: 0,
  bearing: 0,
});

map.on('load', () => {
     map.addSource('trails', {
         type: 'geojson',
         data: 'Lab Assets\W04_L1_A\data\Big_Bend_National_Park_-_Trails.geojson' // note, you'll have to change this if your data file is saved under a different name or not in an enclosing folder named 'data'
     });

     map.addLayer({
       'id': 'trails-layer',
       'type': 'line',
       'source': 'trails',
       'paint': {
           'line-width': 3,
           'line-color': ['match', ['get', 'TRLCLASS'],
              'Class 1: Minimally Developed', 'red',
              'Class 2: Moderately Developed', 'orange',
              'Class 3: Developed', 'yellow',
              /*else,*/ 'blue'
          ]
       }
     });

     map.addSource('bounds', {
        type: 'geojson',
        data: 'Lab Assets\W04_L1_A\data\Terlingua_Ranch_Map_WFL1.geojson'// note again, you may need to change this.
     });

     map.addLayer({
       'id': 'boundary-layer',
       'type': 'line',
       'source': 'bounds',
       'paint': {
            'line-width': 4,
            'line-color': 'black',
            'line-opacity': .6
        }
     });
});

map.on('click', 'trails-layer', (e) => {
  const coordinates = e.lngLat;
    let feature = e.features[0].properties
  const description = "<b>Trail Name: </b>" + feature.TRLNAME + "<br><b>Trail Class: </b>" + feature.TRLCLASS + "<br><b>Trail Length: </b>" + feature.Miles.toFixed(2) +" Miles";

  new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
});

map.on('mouseenter', 'trails-layer', () => {
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'trails-layer', () => {
  map.getCanvas().style.cursor = '';
});

map.on('load', function () {
   map.addSource('mapbox-dem', {
       "type": "raster-dem",
       "url": "mapbox://mapbox.mapbox-terrain-dem-v1",
       'tileSize': 512,
       'maxzoom': 14
   });
    map.setTerrain({"source": "mapbox-dem", "exaggeration": 1.3});

    map.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
        }
    });
});

const navControl = new mapboxgl.NavigationControl({
    visualizePitch: true
});
map.addControl(navControl, 'top-right');

const scaleControl = new mapboxgl.ScaleControl({
    visualizePitch: true,
    unit: 'imperial'
});
map.addControl(scaleControl, 'bottom-left');
