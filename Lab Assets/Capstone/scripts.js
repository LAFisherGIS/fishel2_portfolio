$(document).ready(schoolMap);

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

    let ebJson = L.geoJson(elemBounds, {
      style: sbPaint,
      interactive: false
    });

    let mbJson = L.geoJson(midBounds, {
      style: sbPaint,
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
        risk = feature.properties.OverPol14;
          if (feature.properties.OverPol14 > 59) polluMarker = extremeSchool;
          else if (feature.properties.OverPol14 > 52) polluMarker = veryHeavilySchool;
          else if (feature.properties.OverPol14 > 48) polluMarker = heavilySchool;
          else if (feature.properties.OverPol14 > 28) polluMarker = moderateSchool;
          else if (feature.properties.OverPol14 > 17) polluMarker = lightlySchool;
          else polluMarker = minimallySchool
          let marker = L.marker(latlng, {icon: polluMarker});
          marker.bindPopup("Name: " + feature.properties.NAME + "<br>" + "<br>2014 Pollution Model Score: " + " " + feature.properties.OverPol14.toFixed(3)  + "<br>" + "<br>2015 Pollution Model Score: " + " " + feature.properties.OverPol15.toFixed(3) + "<br>2014 Disadvantage Index: " + " " + feature.properties.OverDisA14 + "<br> 2015 Disadvantage Index: " + " " + feature.properties.OverDisA15 + "<br> 2014 Reading Score (0 = Best): " + " " + feature.properties.r14_over + "<br> 2015 Reading Score (0 = Best): " + " " + feature.properties.r15_over + "<br> 2014 Math Score (0 = Best): " + " " + feature.properties.m14_over + "<br> 2015 Math Score (0 = Best): " + " " + feature.properties.m15_over + "<br>2014 Title I Eligibility (1 = Yes): " + " " + feature.properties.y14_TI +   "<br>2015 Title I Eligibility (1 = Yes): " + " " + feature.properties.y15_TI +  "<br>2014 Free/Reduced Lunch Eligibility (decimal): " + " " + feature.properties.y14_LuPer + "<br>2015 Free/Reduced Lunch Eligibility (decimal): " + " " + feature.properties.y15_LuPer + "<br>2014 Latinx Students (decimal): " + " " + feature.properties.y14_LaPer + "<br>2015 Latinx Students (decimal): " + " " + feature.properties.y15_LaPer + "<br>2014 Native American Students (decimal): " + " " + feature.properties.y14_NaPer + "<br>2015 Native American Students (decimal): " + " " + feature.properties.y15_NaPer + "<br>2014 Black Students (decimal): " + " " + feature.properties.y14_BlPer + "<br>2015 Black Students (decimal): " + " " + feature.properties.y15_BlPer + "<br>2014 Pacific Islander Students (decimal): " + " " + feature.properties.y14_PaPer + "<br>2015 Pacific Islander Students (decimal): " + " " + feature.properties.y15_PaPer)
          return marker;
        }
    });

    let mpJson = L.geoJson(midPoints, {
      pointToLayer: function(feature, latlng){
        let polluMarker,
        risk = feature.properties.OverPol14;
          if (feature.properties.OverPol14 > 55.9) polluMarker = extremeSchool;
          else if (feature.properties.OverPol14 > 51) polluMarker = veryHeavilySchool;
          else if (feature.properties.OverPol14 > 46) polluMarker = heavilySchool;
          else if (feature.properties.OverPol14 > 41) polluMarker = moderateSchool;
          else if (feature.properties.OverPol14 > 21.5) polluMarker = lightlySchool;
          else polluMarker = minimallySchool
          let marker = L.marker(latlng, {icon: polluMarker});
          marker.bindPopup("Name: " + feature.properties.NAME + "<br>" + "<br>2014 Pollution Model Score: " + " " + feature.properties.OverPol14.toFixed(3)  + "<br>" + "<br>2015 Pollution Model Score: " + " " + feature.properties.OverPol15.toFixed(3) + "<br>2014 Disadvantage Index: " + " " + feature.properties.OverDisA14 + "<br> 2015Disadvantage Index: " + " " + feature.properties.OverDisA15 + "<br> 2014 Reading Score (0 = Best): " + " " + feature.properties.r14_over + "<br> 2015 Reading Score (0 = Best): " + " " + feature.properties.r15_over + "<br> 2014 Math Score (0 = Best): " + " " + feature.properties.m14_over + "<br> 2015 Math Score (0 = Best): " + " " + feature.properties.m15_over + "<br>2014 Title I Eligibility (1 = Yes): " + " " + feature.properties.y14_TI +   "<br>2015 Title I Eligibility (1 = Yes): " + " " + feature.properties.y15_TI +  "<br>2014 Free/Reduced Lunch Eligibility (decimal): " + " " + feature.properties.y14_LuPer + "<br>2015 Free/Reduced Lunch Eligibility (decimal ): " + " " + feature.properties.y15_LuPer + "<br>2014 Latinx Students (decimal): " + " " + feature.properties.y14_LaPer + "<br>2015 Latinx Students (decimal): " + " " + feature.properties.y15_LaPer + "<br>2014 Native American Students (decimal): " + " " + feature.properties.y14_NaPer + "<br>2015 Native American Students (decimal): " + " " + feature.properties.y15_NaPer + "<br>2014 Black Students (decimal): " + " " + feature.properties.y14_BlPer + "<br>2015 Black Students (decimal): " + " " + feature.properties.y15_BlPer + "<br>2014 Pacific Islander Students (decimal): " + " " + feature.properties.y14_PaPer + "<br>2015 Pacific Islander Students (decimal): " + " " + feature.properties.y15_PaPer)
          return marker;
        }
    });

    let elem = L.layerGroup([ebJson, epJson])

    let mid = L.layerGroup([mbJson, mpJson])

    let schoolOverlay = {
      "Elementary Schools": elem,
      "Middle Schools": mid
    }

    let schoolMap = L.map('schoolmap', {
      layers:[dark, elem],
      maxBounds : [[47.43396776157878, -122.63860441671564], [47.09334144436703, -122.29401946898379]],
      minZoom : 12
    }).setView([47.2528769, -122.4442906], 12);

    let myControl = L.control.layers(schoolOverlay,'', {collapsed:false}).addTo(schoolMap);

    let Legend =  new L.Control.Legend({
        position: 'bottomleft',
    });

    schoolMap.addControl(Legend);
    $("#schoolmap .legend-container").append( $("#schoollegend") );
}
