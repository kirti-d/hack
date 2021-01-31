// This sample requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let map;
function initMap() {
  // callForMap();
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -33.8688, lng: 151.2195 },
    zoom: 13,
  });
  const input = document.getElementById("pac-input");
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);
  // Specify just the place data fields that you need.
  autocomplete.setFields(["place_id", "geometry", "name", "formatted_address"]);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById("infowindow-content");
  const initialForm=document.getElementById("initialForm");
  const secondForm=document.getElementById("secondForm");
  infowindowContent.appendChild(initialForm);
  infowindowContent.appendChild(secondForm);
  infowindow.setContent(infowindowContent);
  const geocoder = new google.maps.Geocoder();
  const marker = new google.maps.Marker({ map: map });

  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
  
  autocomplete.addListener("place_changed", () => {
    infowindow.close();
    const place = autocomplete.getPlace();

    if (!place.place_id) {
      return;
    }
    geocoder.geocode({ placeId: place.place_id }, (results, status) => {
      if (status !== "OK") {
        window.alert("Geocoder failed due to: " + status);
        return;
      }
      map.setZoom(11);
      map.setCenter(results[0].geometry.location);
      // Set the position of the marker using the place ID and location.
      marker.setPlace({
        placeId: place.place_id,
        location: results[0].geometry.location,
      });
       // make database places visible
       findPlaces();
       marker.setVisible(true);
      $('#yesBtn').click(function(){
        document.getElementById("initialForm").style.visibility = "hidden";
        $.ajax({
         type: 'post',
         url: '/addToilet',
         data:{
           id: place.place_id,
           location: {lat: results[0].geometry.location.lat(), lan: results[0].geometry.location.lng() }
         },success: function(data){
            new Noty({
              theme: 'relax',
              text: "added to database",
              type: 'success',
              layout: 'topRight',
              timeout: 1500
              
            }).show();
         }, error: function(error){
             console.log("error in adding toilet");
         }
       })
    });
    
      infowindowContent.children["place-name"].textContent = place.name;
      infowindowContent.children["place-id"].textContent = place.place_id;
      infowindowContent.children["place-address"].textContent =
        results[0].formatted_address;
      infowindow.open(map, marker);
  });
})}
function findPlaces(){
  $.ajax({
    type: 'get',
    url: '/places',
    data:{
    },success: function(data){
        addMarker(data)
    }, error: function(error){
        console.log("error in adding markers");
    }
})
}


$('#noBtn').click(function(){
  document.getElementById("initialForm").style.visibility = "hidden";
})

function addMarker(data) {
  for(place of data.places){
    console.log(place);
    if(place.type == "toilet"){
    let marker =new google.maps.Marker({
      location: {lat: place.lat, lan: place.lan},
      animation: google.maps.Animation.DROP,
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      map: map,
    });
    marker.setVisible(true);
    }else{
      let marker=new google.maps.Marker({
        location: {lat: place.lat, lan: place.lan},
        animation: google.maps.Animation.DROP,
        icon: (place.rating > 2) ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        map: map,
      });
      marker.setVisible(true);
    }
  }
}