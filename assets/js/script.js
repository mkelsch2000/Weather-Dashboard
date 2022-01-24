// create variables for current data in global scope
var currentTemp = document.getElementById("cityTemp");
var currentWind = document.getElementById("cityWind");
var currentHumid = document.getElementById("cityHumidity");
var currentUV = document.getElementById("cityUV");

// Set empty array
var currentDate = [];

// search API, and push response data to empty array.
var getRequestedPlace = function(event) {
  // prevent reload when submitting
  event.preventDefault()

  // get requested City
  var inputEl = document.getElementById("cityInput");
  var cityNameEl = document.getElementById("cityName");
  cityNameEl.innerHTML = inputEl.value;

  // search API for requested city weather
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + inputEl.value + "&units=imperial&appid=59801c8adee414a87d2a3fdb745b55e5"

  //fetch data and push to empty array
  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        //clear array before data push
        currentDate = [];

          currentDate.push(
          data.main.temp, 
          data.wind.speed, 
          data.main.humidity, 
          data.coord.lat, 
          data.coord.lon);

          // clear search bar value
          inputEl.value = "";

          // call UV index api function
          getUV();
      });
    } else {
      cityNameEl.innerHTML = "City";
      currentTemp.innerHTML = "Temp: ";
      currentWind.innerHTML = "Wind: ";
      currentHumid.innerHTML = "Humidity: ";
      currentUV.innerHTML = "UV Index: ";   
      currentUV.classList.remove("goodUV", "moderateUV", "badUV", "p-1", "round");
      inputEl.value = "";
      alert("There is no city with that name in our database.")
    }
  });
}

// get UV index from separate api url
var getUV = function() {
  // input current array's latitude and longitude coords in api search
  var indexUVUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + currentDate[3] + "&lon=" + currentDate[4] + "&units=imperial&appid=59801c8adee414a87d2a3fdb745b55e5"

  // fetch new api data and push UV index to currentDate Array
  fetch(indexUVUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        currentDate.push(
          data.current.uvi
        );

        // call Function to set current day weather
        currentWeather();
      });
    }
  });
};

// Function to set current weather
var currentWeather = function() {

  // reset element data
  currentTemp.innerHTML = "Temp: ";
  currentWind.innerHTML = "Wind: ";
  currentHumid.innerHTML = "Humidity: ";
  currentUV.innerHTML = "UV Index: ";

  // set new data to elements
  currentTemp.innerHTML += currentDate[0] + "\xB0";
  currentWind.innerHTML += currentDate[1] + " MPH";
  currentHumid.innerHTML += currentDate[2] + "%";
  currentUV.innerHTML += currentDate[5];

  if (currentDate[5] <= 2) {
    currentUV.classList.add("goodUV", "p-1", "round");

  } else if (currentDate[5] >= 3 && currentDate[5] <= 6) {
    currentUV.classList.add("moderateUV", "p-1", "round");

  } else {
    currentUV.classList.add("badUV", "p-1", "round");
  };

}

document.getElementById("search").addEventListener("click", getRequestedPlace);


