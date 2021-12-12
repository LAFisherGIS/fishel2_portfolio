$(document).ready(pollutionMap);
$(document).ready(clusterMap);
$(document).ready(schoolMap);
$(document).ready(parkMap);
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

function pollutionMap(){

    let dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/" target="_null">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_null">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/" target="_null">Mapbox</a>',
        maxZoom: 18,
        id:'lafishergis/ckvwv1qz354hp14s8pcasgvi8',
        accessToken: 'sk.eyJ1IjoibGFmaXNoZXJnaXMiLCJhIjoiY2t2OXJ4dnV1YTY2ZjJwbnpjM3BxbWRnYiJ9.CW4oaT94TkbelBF0Fj4rJw',
        tileSize: 512,
        zoomOffset: -1,
    });

    let pbgMap = L.map('pbgmap', {
      layers:[dark],
      maxBounds : [[47.37396776157878, -122.63860441671564], [47.09334144436703, -122.29401946898379]],
      minZoom : 12
    }).setView([47.2528769, -122.4442906], 12);

//This is a six class jenks natural breaks classification

//Thanks to leaflet for guidance starts here https://leafletjs.com/examples/choropleth/


    function colorization(d) {
        return d > 15       ? '#b30000' :
              d > 7         ? '#e34a33' :
              d > 3         ? '#fc8d59' :
              d > 1         ? '#fdbb84' :
              d > 0         ? '#fdd49e' :
                              '#fef0d9';
    }

    function bgPaint(feature) {
        return {
            fillColor: colorization(feature.properties.Pollution_),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5
        };
    }

    let info = L.control();

    info.onAdd = function infoDiv(pbgMap) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function infoFill(props) {
        this._div.innerHTML = '<h4>Blockgroup Demographics and Pollution</h4>' +  (props ?
            '<b>' + '(For Ethnicities, 1 = 100%, 0 = 0%)' + '<br>' + '<b>' + 'Pollution Index ' + props.Pollution_ + '</b><br />'  + 'Socioeconomic Status Index ' + props.Socioecono + '<br />' + 'White Portion ' + props.White_Port.toFixed(3) + '<br />' + 'Black Portion ' + props.Black_Port.toFixed(3) + '<br />' + 'Native American Portion ' + props.Native_Por.toFixed(3) + '<br />' + 'Asian Portion ' + props.Asian_Port.toFixed(3) + '<br />' + 'Pacific Islander Portion ' + props.Pacific_Po.toFixed(3) + '<br />' + 'Multiracial Portion ' + props.Multiracia.toFixed(3) + '<br />' + 'Portion of Other Ethnicities ' + props.Other_Port.toFixed(3) + '<br />'
            : 'Hover over a blockgroup to learn more.');
    };

    info.addTo(pbgMap);

    function scrollOn(e) {
      let layer = e.target;
      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
      info.update(layer.feature.properties);
    }

    function scrollOff(e) {
      geojson.resetStyle(e.target);
      info.update();
    }

    function zoomClick(e) {
      pbgMap.fitBounds(e.target.getBounds());
    }

    function mouseIntegration(feature, layer) {
      layer.on({
          mouseover: scrollOn,
          mouseout: scrollOff,
          click: zoomClick
      });
    }

    let geojson = L.geoJson(pollutionBlockgroups, {
      style: bgPaint,
      onEachFeature: mouseIntegration
    }).addTo(pbgMap);

    // Thanks to leaflet for guidance ends here https://leafletjs.com/examples/choropleth/ - these elements are repeated in some other maps as well, but will not be credited again.

    let Legend =  new L.Control.Legend({
        position: 'bottomleft',
    });

    pbgMap.addControl(Legend);
    $("#pbgmap .legend-container").append( $("#pbglegend") );
}

function clusterMap(){

    let dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/" target="_null">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_null">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/" target="_null">Mapbox</a>',
        maxZoom: 18,
        id:'lafishergis/ckvwv1qz354hp14s8pcasgvi8',
        accessToken: 'sk.eyJ1IjoibGFmaXNoZXJnaXMiLCJhIjoiY2t2OXJ4dnV1YTY2ZjJwbnpjM3BxbWRnYiJ9.CW4oaT94TkbelBF0Fj4rJw',
        tileSize: 512,
        zoomOffset: -1,
    });

    function colorization(d) {
        return d == 'HH'       ? '#045a8d' :
              d == 'HL'        ? '#2b8cbe' :
              d == 'LH'        ? '#bdc9e1' :
              d == 'LL'        ? '#f1eef6' :
                               '#74a9cf';
    }

    function clustPaint(feature) {
        return {
            fillColor: colorization(feature.properties.COType),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5
        };
    }

    let polluJson = L.geoJson(pollutionCluster, {
      style: clustPaint,
      interactive: false
    });

    let socioJson = L.geoJson(socioeconomicCluster, {
      style: clustPaint,
      interactive: false
    });

    let whiteJson = L.geoJson(whitePop, {
      style: clustPaint,
      interactive: false
    });

    let blackJson = L.geoJson(blackPop, {
      style: clustPaint,
      interactive: false
    });

    let nativeJson = L.geoJson(nativePop, {
      style: clustPaint,
      interactive: false
    });

    let asianJson = L.geoJson(asianPop, {
      style: clustPaint,
      interactive: false
    });

    let pacificJson = L.geoJson(pacificPop, {
      style: clustPaint,
      interactive: false
    });

    let multiJson = L.geoJson(multiPop, {
      style: clustPaint,
      interactive: false
    });

    let otherJson = L.geoJson(otherPop, {
      style: clustPaint,
      interactive: false
    });

// Thanks to leaflet for guidance on layer groups and controls https://leafletjs.com/examples/layers-control/

    let clusterOverlay = {
      "Pollution Clusters": polluJson,
      "Socioeconomic Status Clusters": socioJson,
      "White Population Clusters": whiteJson,
      "Black Population Clusters": blackJson,
      "Native American Population Clusters": nativeJson,
      "Asian Population Clusters": asianJson,
      "Pacific Islander Population Clusters": pacificJson,
      "Multiracial Population Clusters": multiJson,
      "Other Ethnicity Population Clusters": otherJson
    }

    let clusterMap = L.map('clustermap', {
      layers:[dark, polluJson],
      maxBounds : [[47.37396776157878, -122.63860441671564], [47.09334144436703, -122.29401946898379]],
      minZoom : 12
    }).setView([47.2528769, -122.4442906], 12);

    let myControl = L.control.layers(clusterOverlay,'', {collapsed:false}).addTo(clusterMap);

    let Legend =  new L.Control.Legend({
        position: 'bottomleft',
    });

    clusterMap.addControl(Legend);
    $("#clustermap .legend-container").append( $("#clusterlegend") );

    let clusterCats = ["SES Index Score","White Population","Black Population","Native Population","Asian Population","Pacific Islander Population","Other Population","Multiracial Population"];

    let clusterStats = [-0.101,-0.093,0.063,0.185,0.110,0.019,-0.034,-0.020];

    let clusterTarget = document.getElementById("clusterChart");

    let clusterChart = new Chart(clusterTarget, {
      type: 'bar',
      data: {
        labels: clusterCats,
        datasets: [
          {
            label: "Correlation Coefficients for Demographic Blockgroup Traits and Pollution",
            backgroundColor: "#3e95cd",
            data: clusterStats
          }
        ]
      },
      options: {
        legend: { display: false },
      }
    });
}

function schoolMap(){

    let dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/" target="_null">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_null">CC-BY-SA</a>, Imagery & Markers © <a href="https://www.mapbox.com/" target="_null">Mapbox</a>',
        maxZoom: 18,
        id:'lafishergis/ckvwv1qz354hp14s8pcasgvi8',
        accessToken: 'sk.eyJ1IjoibGFmaXNoZXJnaXMiLCJhIjoiY2t2OXJ4dnV1YTY2ZjJwbnpjM3BxbWRnYiJ9.CW4oaT94TkbelBF0Fj4rJw',
        tileSize: 512,
        zoomOffset: -1,
    });

    function sbPaint(feature) {
        return {
            fillColor: '#808000',
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.5
        };
    }

    function sgPaint(feature) {
        return {
            fillColor: '#2b8cbe',
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5
        };
    }

    let ebJson = L.geoJson(elemBounds, {
      style: sbPaint,
      interactive: false
    });

    let mbJson = L.geoJson(midBounds, {
      style: sbPaint,
      interactive: false
    });

    let egJson = L.geoJson(elemGrounds, {
      style: sgPaint,
      interactive: false
    });

    // Thanks to jseppi for their guide on how to use MakiMarkers https://github.com/jseppi/Leaflet.MakiMarkers/blob/master/index.html

    L.MakiMarkers.accessToken = "sk.eyJ1IjoibGFmaXNoZXJnaXMiLCJhIjoiY2t2OXJ4dnV1YTY2ZjJwbnpjM3BxbWRnYiJ9.CW4oaT94TkbelBF0Fj4rJw";

    const extremeSchool = L.MakiMarkers.icon({
      icon: "school",
      color: "bd0026",
      size: "s"
    });

    const veryHeavilySchool = L.MakiMarkers.icon({
      icon: "school",
      color: "f03b20",
      size: "s"
    });

    const heavilySchool = L.MakiMarkers.icon({
      icon: "school",
      color: "fd8d3c",
      size: "s"
    });

    const moderateSchool= L.MakiMarkers.icon({
      icon: "school",
      color: "feb24c",
      size: "s"
    });

    const lightlySchool= L.MakiMarkers.icon({
      icon: "school",
      color: "fed976",
      size: "s"
    });

    const minimallySchool= L.MakiMarkers.icon({
      icon: "school",
      color: "ffffb2",
      size: "s"
    });


    let epJson = L.geoJson(elemPoints, {
      pointToLayer: function(feature, latlng){
        let polluMarker,
        risk = feature.properties.Pollution_;
          if (feature.properties.Pollution_ > 15) polluMarker = extremeSchool;
          else if (feature.properties.Pollution_ > 7) polluMarker = veryHeavilySchool;
          else if (feature.properties.Pollution_ > 3) polluMarker = heavilySchool;
          else if (feature.properties.Pollution_ > 1) polluMarker = moderateSchool;
          else if (feature.properties.Pollution_ > 0) polluMarker = lightlySchool;
          else polluMarker = minimallySchool
          let marker = L.marker(latlng, {icon: polluMarker});
          marker.bindPopup("Name: " + feature.properties.NAME + "<br>Address: " + feature.properties.ADDRESS + "<br> Grades: " + feature.properties.GRADE + "<br>" + "<br>Pollution Index: " + " " + feature.properties.Pollution_ + "<br>Average Socioeconomic Status Index: " + " " + feature.properties.MEAN_SES.toFixed(3) + "<br>White Portion of Cachement Area: " + " " + feature.properties.MEAN_White.toFixed(3) + "<br>Black Portion of Cachement Area: " + " " + feature.properties.MEAN_Black.toFixed(3) + "<br>Native American Portion of Cachement Area: " + " " + feature.properties.MEAN_Nativ.toFixed(3) + "<br>Asian Portion of Cachement Area: " + " " + feature.properties.MEAN_Asian.toFixed(3) + "<br>Pacific Islander Portion of Cachement Area: " + " " + feature.properties.MEAN_Pacif.toFixed(3) + "<br>Multiracial Portion of Cachement Area: " + " " + feature.properties.MEAN_Multi.toFixed(3) + "<br>Other Ethnicity Portion of Cachement Area: " + " " + feature.properties.MEAN_Other.toFixed(3))
          if (feature.properties.Pollution_ !== "")
          return marker;
        }
    });

    let mgJson = L.geoJson(midGrounds, {
      style: sgPaint,
      interactive: false
    });

    let mpJson = L.geoJson(midPoints, {
      pointToLayer: function(feature, latlng){
        let polluMarker,
        risk = feature.properties.Pollution_;
          if (feature.properties.Pollution_ > 15) polluMarker = extremeSchool;
          else if (feature.properties.Pollution_ > 7) polluMarker = veryHeavilySchool;
          else if (feature.properties.Pollution_ > 3) polluMarker = heavilySchool;
          else if (feature.properties.Pollution_ > 1) polluMarker = moderateSchool;
          else if (feature.properties.Pollution_ > 0) polluMarker = lightlySchool;
          else polluMarker = minimallySchool
          let marker = L.marker(latlng, {icon: polluMarker});
          marker.bindPopup("Name: " + feature.properties.NAME + "<br>Address: " + feature.properties.ADDRESS + "<br> Grades: " + feature.properties.GRADE + "<br>" + "<br>Pollution Index: " + " " + feature.properties.Pollution_ + "<br>Average Socioeconomic Status Index of Catchment Area: " + " " + feature.properties.MEAN_SES.toFixed(3) + "<br>White Portion of Catchment Area: " + " " + feature.properties.MEAN_White.toFixed(3) + "<br>Black Portion of Catchment Area: " + " " + feature.properties.MEAN_Black.toFixed(3) + "<br>Native American Portion of Catchment Area: " + " " + feature.properties.MEAN_Nativ.toFixed(3) + "<br>Asian Portion of Catchment Area: " + " " + feature.properties.MEAN_Asian.toFixed(3) + "<br>Pacific Islander Portion of Catchment Area: " + " " + feature.properties.MEAN_Pacif.toFixed(3) + "<br>Multiracial Portion of Catchment Area: " + " " + feature.properties.MEAN_Multi.toFixed(3) + "<br>Other Ethnicity Portion of Catchment Area: " + " " + feature.properties.MEAN_Other.toFixed(3))
          if (feature.properties.Pollution_ !== "")
          return marker;
        }
    });

    let elem = L.layerGroup([ebJson, egJson, epJson])

    let mid = L.layerGroup([mbJson, mgJson, mpJson])

    let schoolOverlay = {
      "Elementary Schools": elem,
      "Middle Schools": mid
    }

    let schoolMap = L.map('schoolmap', {
      layers:[dark, elem],
      maxBounds : [[47.37396776157878, -122.63860441671564], [47.09334144436703, -122.29401946898379]],
      minZoom : 12
    }).setView([47.2528769, -122.4442906], 12);

    let myControl = L.control.layers(schoolOverlay,'', {collapsed:false}).addTo(schoolMap);

    let Legend =  new L.Control.Legend({
        position: 'bottomleft',
    });

    schoolMap.addControl(Legend);
    $("#schoolmap .legend-container").append( $("#schoollegend") );

    let schoolCats = ["SES Index Score","White Population","Black Population","Native Population","Asian Population","Pacific Islander Population","Other Population","Multiracial Population"];

    let esStats = [-0.027,-0.041,0.226,0.031,-0.027,-0.091,-0.010,-0.077];

    let msStats = [-0.227,-0.290,0.530,-0.069,0.238,-0.225,0.058,0.295];

    let esTarget = document.getElementById("esChart");

    let msTarget = document.getElementById("msChart");

    let esChart = new Chart(esTarget, {
      type: 'bar',
      data: {
        labels: schoolCats,
        datasets: [
          {
            label: "Correlation Coefficients for Demographic Elementary School Traits and Pollution",
            backgroundColor: "#3e95cd",
            data: esStats
          }
        ]
      },
      options: {
        legend: { display: false },
      }
    });

    let msChart = new Chart(msTarget, {
      type: 'bar',
      data: {
        labels: schoolCats,
        datasets: [
          {
            label: "Correlation Coefficients for Demographic Middle School Traits and Pollution",
            backgroundColor: "#3e95cd",
            data: msStats
          }
        ]
      },
      options: {
        legend: { display: false },
      }
    });
}

function parkMap(){

    let dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/" target="_null">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_null">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/" target="_null">Mapbox</a>',
        maxZoom: 18,
        id:'lafishergis/ckvwv1qz354hp14s8pcasgvi8',
        accessToken: 'sk.eyJ1IjoibGFmaXNoZXJnaXMiLCJhIjoiY2t2OXJ4dnV1YTY2ZjJwbnpjM3BxbWRnYiJ9.CW4oaT94TkbelBF0Fj4rJw',
        tileSize: 512,
        zoomOffset: -1,
    });

    let parkMap = L.map('parkmap', {
      layers:[dark],
      maxBounds : [[47.37396776157878, -122.63860441671564], [47.09334144436703, -122.29401946898379]],
      minZoom : 12
    }).setView([47.2528769, -122.4442906], 12);

    let info = L.control();

    info.onAdd = function infoDiv(parkMap) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function infoFill(props) {
        this._div.innerHTML = '<h4>Park Service Area Demographics and Pollution</h4>' +  (props ?
            '<b>' + '(For Ethnicities, 1 = 100%, 0 = 0%)' + '<br><b>' + 'Name: ' + props.Name + '</b><br />' + '<b>' + 'Average Pollution Index of Grounds ' + props.Pollution_ + '</b><br />'  + 'Average Socioeconomic Status Index pf Service Area: ' + props.MEAN_SES.toFixed(3) + '<br />' + 'White Portion of Service Area: ' + props.MEAN_White.toFixed(3) + '<br />' + 'Black Portion of Service Area: ' + props.MEAN_Black.toFixed(3) + '<br />' + 'Native American Portion of Service Area: ' + props.MEAN_Nativ.toFixed(3) + '<br />' + 'Asian Portion of Service Area: ' + props.MEAN_Asian .toFixed(3)+ '<br />' + 'Pacific Islander Portion of Service Area: ' + props.MEAN_Pacif.toFixed(3) + '<br />' + 'Multiracial Portion of Service Area: ' + props.MEAN_Multi.toFixed(3) + '<br />' + 'Portion of Other Ethnicities of Service Area: ' + props.MEAN_Other.toFixed(3) + '<br />'
            : "Hover over a park's grounds to learn more.");
    };

    info.addTo(parkMap);

    function scrollOn(e) {
      let layer = e.target;
      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
      info.update(layer.feature.properties);
    }

    function scrollOff(e) {
      geojson.resetStyle(e.target);
      info.update();
    }

    function zoomClick(e) {
      parkMap.fitBounds(e.target.getBounds());
    }

    function mouseIntegration(feature, layer) {
      layer.on({
          mouseover: scrollOn,
          mouseout: scrollOff,
          click: zoomClick
      });
    }

    function psPaint(feature) {
        return {
            fillColor: '#808000',
            weight: 1,
            opacity: 0.1,
            color: 'white',
            fillOpacity: 0.5
        };
    }

    function colorization(d) {
        return d > 15       ? '#b30000' :
              d > 7         ? '#e34a33' :
              d > 3         ? '#fc8d59' :
              d > 1         ? '#fdbb84' :
              d > 0         ? '#fdd49e' :
                              '#fef0d9';
    }

    function pgPaint(feature) {
        return {
            fillColor: colorization(feature.properties.MEAN_Pol_1),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5
        };
    }

    let psJson = L.geoJson(parkService, {
      style: psPaint,
      interactive: false
    }).addTo(parkMap);

    let geojson = L.geoJson(parkGrounds, {
      style: pgPaint,
      onEachFeature: mouseIntegration
    }).addTo(parkMap);

    let ppJson = L.geoJson(parkEntrance, {
      interactive: false,
      pointToLayer: function(feature, latlng){
        let marker = L.circle(latlng, {size: 's', color: 'green'});
        return marker;
        }

    }).addTo(parkMap);

    let Legend =  new L.Control.Legend({
        position: 'bottomleft',
    });

    parkMap.addControl(Legend);
    $("#parkmap .legend-container").append( $("#parklegend") );

    let parkCats = ["SES Index Score","White Population","Black Population","Native Population","Asian Population","Pacific Islander Population","Other Population","Multiracial Population"];

    let parkStats = [-0.084,-0.097,0.196,-0.034,0.154,0.063,-0.090,-0.043];

    let parkTarget = document.getElementById("parkChart");

    let parkChart = new Chart(parkTarget, {
      type: 'bar',
      data: {
        labels: parkCats,
        datasets: [
          {
            label: "Correlation Coefficients for Demographic Blockgroup Traits and Pollution",
            backgroundColor: "#3e95cd",
            data: parkStats
          }
        ]
      },
      options: {
        legend: { display: false },
      }
    });
}
