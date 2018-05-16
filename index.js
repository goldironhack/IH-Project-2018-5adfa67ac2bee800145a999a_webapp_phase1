// google maps API
const API_KEY ="AIzaSyC0HTI1ZBcWCdA-VxGzRMVvu2vrhn4vgBs";
// Neighborhood Names GIS DataSet
const URL_NEIGHNAMES = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
//NY Districts geoshapes DataSet
const URL_GEOSHAPES = "http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";

var map;
var nyu_coordinates = {lat:40.729055, lng:-73.996523};
var nyu_marker;
var neighMarkers = [];
var directionsService;
var directionsDisplay;

function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
    center: nyu_coordinates,
    zoom: 17
  });

  nyu_marker = new google.maps.Marker({
    map: map,
    position: nyu_coordinates,
    title: 'N.Y.U. stern school of business',
  });
  map.data.loadGeoJson(URL_GEOSHAPES);
  map.data.setStyle({visible: false});
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
}

function getCentroids(){
  var data = $.get(URL_NEIGHNAMES,function(){
      
  })
  .done(function(){
      //success
        
      for (var i = 0; i < data.responseJSON.data.length; i++) {
        var n = data.responseJSON.data[i][9];
        var numeritos = n.substr(n.indexOf("(")+1,(n.indexOf(")")-n.indexOf("(")-1));
        var lg = numeritos.substr(0,numeritos.indexOf(" "));
        lg = Number(lg);
        var lt = numeritos.substr(numeritos.indexOf(" ")+1,n.length/2);
        lt = Number(lt);
        neighMarkers[i]= new google.maps.Marker({
          map: map,
          position: {lat:lt,lng:lg},
          title: 'marker '+i,
        });
        var request = {
            origin: {lat:lt,lng:lg},
            destination: nyu_coordinates,
            travelMode: google.maps.TravelMode.WALKING
        };
        
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);
            } else {
                console.log('error');
            }
        });
        
      };
    })
  .fail(function(error){
      console.log(error);
    })
}

function drawPolygons(){
  map.data.setStyle(function(feature){
    var id = feature.getProperty('OBJECTID');
    var colorArray = ['red','green','blue','yellow','white','orange','white'];
    var color;
    if(id < 10){
      color = colorArray[0];
    }
    if(id >=10 && id < 20){
      color = colorArray[1];
    }
    if(id >=20 && id < 30){
      color = colorArray[2];
    }
    if(id >=40 && id < 50){
      color = colorArray[3];
    }
    if(id >=50 && id < 60){
      color = colorArray[4];
    }
    if(id >=60 && id < 80){
      color = colorArray[5];
    }
    
    return {
      fillColor: color,
      strokeWeight: 2,
      strokeColor: color,
      fillOpacity: 0.3,
    }
    
  });
}

function rstMap(){
    map.data.setStyle({visible: false});
}

$(document).ready(function(){
  $("#getCentroidsButton").on("click",getCentroids);
  $("#getPolygonsButton").on("click",drawPolygons);
  $("#getRstButton").on("click",rstMap);
})
