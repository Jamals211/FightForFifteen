// Verify that JS is working
console.log("working");

//first tile layer
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'mapbox.streets',
      accessToken: API_KEY
  });

// Adding a second tile layer
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Adding a third tile layer
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
  accessToken: API_KEY
});
  
//create a new variable that takes in the two variables above
//to toggle in between the three styles
let baseMaps = {
  "Streets": streets,
  "Satellite": satelliteStreets,
  "Dark":dark
};

//create an overlay
let earthquakes=new L.layerGroup()

// Overlays
let overlays = {
  "Minimum Wage": earthquakes
  };

// Center Level Zoom
let map = L.map('mapid', {
	center: [39.5, -98.5],
	zoom: 3,
	layers: [streets]
})

//Radius of Circle
function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}

// This function determines the color of the circle based on the magnitude of the earthquake.
function getColor(magnitude) {
    if (magnitude > 11) {
      return "#ea2c2c";
    }
    if (magnitude > 8) {
      return "#ea822c";
    }
    if (magnitude > 6) {
      return "#ee9c00";
    }
    if (magnitude > 4) {
      return "#eecc00";
    }
    if (magnitude > 0.50) {
      return "#d4ee00";
    }
    return "#98ee00";
  }

// //get rid of mag of zero
function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }
  // return magnitude * 4;
}

//control to switch back and forth, add overlays to the map
L.control.layers(baseMaps,overlays).addTo(map);

// Add earthquake data to the map
// earthquakeURL=json
// console.log(earthquakeURL);

d3.json('GTwenty.json').then (function(data)
{
// Creating a GeoJSON layer with the retrieved data.
L.geoJson(data, 
    {
//use pointToLayer to create circleMarkers
    pointToLayer: function(feature, latlng) 
    {
        return L.circleMarker(latlng);
    },
        style: styleInfo,
        onEachFeature: function(feature,layer)
        {
            layer.bindPopup(`${"Magnitude :"+feature.properties.mag}<br><hr>${"Location: "+feature.properties.place}`)
        }
    }).addTo(earthquakes); //Add to layer group earthquakes
    earthquakes.addTo(map) //Add to layer group earthquakes



var legend = L.control({position: 'bottomright'});
legend.onAdd = function () 
{
    var div = L.DomUtil.create('div', 'info legend')
    const magnitudes = [0, 7, 8, 10, 12, 14];
    const colors = 
    [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];
        labels = [];
    // Looping through our intervals to generate a label with a colored square for each interval.
   for (var i = 0; i < magnitudes.length; i++) 
   {
    console.log(colors[i]);
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }
  return div;
};

legend.addTo(map);
});

