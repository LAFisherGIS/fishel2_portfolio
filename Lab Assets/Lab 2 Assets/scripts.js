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
  var mymap = L.map('map', {
    // Thanks to Sebastian Nowak for guidance on how to move the zoom controls. See end of function for the remainder of the derived code. (Last Answer) https://stackoverflow.com/questions/22926512/customize-zoom-in-out-button-in-leaflet-js
    zoomControl : true,
    maxBounds : [[47.33126776157878, -122.63860441671564], [47.09334144436703, -122.29401946898379]],
    minZoom : 12
  }).setView([47.2528769, -122.4442906], 12);

  var basemap = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png', {
			attribution: 'School Icons &copy by <a href="https://www.mapbox.com/" target="_blank">Mapbox</a>, Map tiles by <a href="http://stamen.com" target="_blank">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0" target="_blank">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
		}).addTo(mymap);

  $.getJSON("Data/Neighborhood_Council_Districts_(Tacoma).geojson",function(data){
     L.geoJson(data, {
       style: function(district){
         if (district.properties.NAME === "NEW TACOMA") return {color:'purple'}
         else if (district.properties.NAME === "SOUTH TACOMA") return {color:'rebeccapurple'}
         else if (district.properties.NAME === "NORTH EAST") return {color:'rebeccapurple'}
         else if (district.properties.NAME === "SOUTH END") return {color:'rebeccapurple'}
         else if (district.properties.NAME === "EASTSIDE") return {color:'slateblue'}
         else if (district.properties.NAME === "CENTRAL") return {color:'slateblue'}
         else if (district.properties.NAME === "NORTH END") return {color:'slateblue'}
         else if (district.properties.NAME === "WEST END") return {color:'plum'}
         else return {color:'slategray'}
       }
       }).addTo(mymap);
  });

  $.getJSON("Data/School_Grounds.geojson",function(data){
     L.geoJson(data, {
       style: function(grounds){
         if (grounds.properties.CITY === "TACOMA") return {opacity:1, color:'black'}
         else return {opacity:0}
       }
       }).addTo(mymap);
  });

  $.getJSON("Data/Contaminated_Sites_(Ecology).geojson",function(data){
     L.geoJson(data, {
       pointToLayer: function(feature, latlng){
        var riskColor,
        risk = feature.properties.SiteRank;
          if (feature.properties.SiteRank === "0 - NPL Site (Fed HRS Score)") riskColor = 'maroon';
          else if (feature.properties.SiteRank === "1 - Highest Assessed Risk") riskColor = 'red';
          else if (feature.properties.SiteRank === "2 - Moderate-High Risk") riskColor = 'orangered';
          else if (feature.properties.SiteRank === "3 - Moderate Risk") riskColor = 'orange';
          else if (feature.properties.SiteRank === "4 - Low-Moderate Risk") riskColor = 'goldenrod';
          else if (feature.properties.SiteRank === "5 - Lowest Assessed Risk") riskColor = 'yellow';
        var marker = L.circle(latlng, {radius: 200, color: riskColor});
          if (feature.properties.SiteRank !== "")
          return marker;
       }
     }).addTo(mymap);
  });

// Thanks to jseppi for their guide on how to use MakiMarkers https://github.com/jseppi/Leaflet.MakiMarkers/blob/master/index.html

  L.MakiMarkers.accessToken = "sk.eyJ1IjoibGFmaXNoZXJnaXMiLCJhIjoiY2t2OXJ4dnV1YTY2ZjJwbnpjM3BxbWRnYiJ9.CW4oaT94TkbelBF0Fj4rJw";

  const schoolIcon = L.MakiMarkers.icon({
    icon: "school",
    color: "006400",
    size: "s"
  });

  $.getJSON("Data/Schools.geojson",function(data){
     L.geoJson(data, {
       pointToLayer: function(feature, latlng){
         var marker = L.marker(latlng, {icon: schoolIcon});
         marker.bindPopup("Name: " + feature.properties.NAME + "<br>Address: " + feature.properties.ADDRESS + "<br> School Type: " + feature.properties.TYPE)
         if (feature.properties.CITY === "TACOMA")
         return marker;
       }
     }).addTo(mymap);

// end of MakiMarkers

  var Legend =  new L.Control.Legend({
		position: 'topleft',
	});

	mymap.addControl(Legend);
	$(".legend-container").append( $("#legend") );

// Thanks to Sebastian Nowak for guidance n moving the zoom controls. (Last answer) https://stackoverflow.com/questions/22926512/customize-zoom-in-out-button-in-leaflet-js

  mymap.zoomControl.setPosition('topright');

  });
}
