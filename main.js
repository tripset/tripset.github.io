var map;

var rowSize = 150; // => container height / number of items
var container = document.querySelector(".container");
var listItems = Array.from(document.querySelectorAll(".list-item")); // Array of elements
var sortables = listItems.map(Sortable); // Array of sortables
var total = sortables.length;

var directionsService;
var directionsDisplay;

var updateValues = [];
var waypts = [];

function initMap() {
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: {lat: 41.85, lng: -87.65}
  });
  

  directionsDisplay.setMap(map);
  
  changeValues()
  addMarkers()  

  calculateAndDisplayRouteWithValues(directionsService, directionsDisplay, updateValues);
  
}

function addMarkers() {
  for (var i = 0; i < updateValues.length; i++) {
    var pic;
    if (i == 0) {
      console.log('again')
      var first = new google.maps.MarkerImage(
        './images/1.png',
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new google.maps.Size(27, 43)
      );  
      pic = first;
      
    } else if (i == 1) {
      var second = new google.maps.MarkerImage(
        './images/2.png',
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new google.maps.Size(27, 43)
      );  
      pic = second;
      
    } else if (i == 2) {
      var third = new google.maps.MarkerImage(
        './images/3.png',
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new google.maps.Size(27, 43)
      );  
      pic = third;
      
    } else if (i == 3) {
      var fourth = new google.maps.MarkerImage(
        './images/4.png',
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new google.maps.Size(27, 43)
      );  
      pic = fourth;
    }
    
    var marker = new google.maps.Marker(
    {
        position: updateValues[i],
        map:map,
        icon: pic,
        shadow:'https://chart.googleapis.com/chart?chst=d_map_pin_shadow',
        zIndex: 5
    });
  }

  
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  var waypts = [];
  var checkboxArray = listItems;
  for (var i = 1; i < checkboxArray.length-1; i++) {
    waypts.push({
      location: checkboxArray[i].attributes.value.value,
      stopover: true
    });
    
  }
  
  var start_dest = checkboxArray[0].attributes.value.value
  var end_dest = checkboxArray[checkboxArray.length - 1].attributes.value.value
  

  directionsService.route({
    origin: start_dest,
    destination: end_dest,
    waypoints: waypts,
    optimizeWaypoints: true,
    travelMode: 'DRIVING', 
    
  }, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      new google.maps.DirectionsRenderer({
          map: map,
          directions: response,
          suppressMarkers: true
      });

    } else {
     window.alert('Directions request failed due to ' + status);
    }
    
  
  });
}

function calculateAndDisplayRouteWithValues(directionsService, directionsDisplay, theUpdates) {
  waypts = [];
  var checkboxArray = theUpdates;
  for (var i = 1; i < checkboxArray.length-1; i++) {
    waypts.push({
      location: checkboxArray[i],
      stopover: true
    });
    
  }
  var start_dest = checkboxArray[0]
  var end_dest = checkboxArray[checkboxArray.length - 1]
  

  directionsService.route({
    origin: start_dest,
    destination: end_dest,
    waypoints: waypts,
    optimizeWaypoints: true,
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      new google.maps.DirectionsRenderer({
          map: map,
          directions: response,
          suppressMarkers: true
      });

    } else {
     window.alert('Directions request failed due to ' + status);
    }
    
  });
  

}

TweenLite.to(container, 0.5, { autoAlpha: 1 });


function changeValues() {
  updateValues = [];
  var temp = [];
  var txt = ""
  for (var i = 0; i < listItems.length; i++) {
    txt = listItems[i].innerText
    console.log("inner" + txt)

    var numbers = listItems[i].innerText
    txt = txt.replace(/[0-9]/g, '');
    txt = txt.trim();
    numbers = numbers.replace(/\D/g, '');
    var to_replace = '';
    console.log(txt)
    if (txt == ". Dolores Park") {
      console.log('madeit')
      to_replace = { lat: 37.761381, lng: -122.427279};
    } else if (txt == '. Golden Gate Park') {
      to_replace = { lat: 37.769493, lng: -122.486195};
    } else if (txt == '. Academy of Sciences') {
      to_replace = { lat: 37.770195, lng: -122.466899};
    } else if (txt == '. Twin Peaks') {
      to_replace = { lat: 37.752487, lng: -122.447723};
    }
    console.log(to_replace)
    temp[numbers-1] = to_replace
    console.log(temp[numbers-1])
  }
  console.log(temp)
  updateValues = temp;
  console.log(updateValues)
}

function changeIndex(item, to) {
  // Change position in array
  arrayMove(sortables, item.index, to);

  // Change element's position in DOM. Not always necessary. Just showing how.
  if (to === total - 1) {
    container.appendChild(item.element);
  } else {
    var i = item.index > to ? to : to + 1;
    container.insertBefore(item.element, container.children[i]);
  }

  // Set index for each sortable
  sortables.forEach(function (sortable, index) {return sortable.setIndex(index);});
  changeValues()
  addMarkers()
  console.log(updateValues)
  calculateAndDisplayRouteWithValues(directionsService, directionsDisplay, updateValues);
  
}

function Sortable(element, index) {

  var content = element.querySelector(".item-content");
  var order = element.querySelector(".order");

  var animation = TweenLite.to(content, 0.3, {
    boxShadow: "rgba(0,0,0,0.2) 0px 8px 8px 0px",
    force3D: true,
    scale: 1.1,
    paused: true });


  var dragger = new Draggable(element, {
    onDragStart: downAction,
    onRelease: upAction,
    onDrag: dragAction,
    cursor: "inherit",
    type: "y" });


  // Public properties and methods
  var sortable = {
    dragger: dragger,
    element: element,
    index: index,
    setIndex: setIndex };


  TweenLite.set(element, { y: index * rowSize });

  function setIndex(index) {

    sortable.index = index;
    order.textContent = index + 1;

    // Don't layout if you're dragging
    if (!dragger.isDragging) layout();
  }

  function downAction() {
    animation.play();
    this.update();
  }

  function dragAction() {

    // Calculate the current index based on element's position
    var index = clamp(Math.round(this.y / rowSize), 0, total - 1);

    if (index !== sortable.index) {
      changeIndex(sortable, index);
    }
  }

  function upAction() {
    animation.reverse();
    layout();
  }

  function layout() {
    TweenLite.to(element, 0.3, { y: sortable.index * rowSize });
  }

  return sortable;
}

// Changes an elements's position in array
function arrayMove(array, from, to) {
  array.splice(to, 0, array.splice(from, 1)[0]);
}

// Clamps a value to a min/max
function clamp(value, a, b) {
  return value < a ? a : value > b ? b : value;
}