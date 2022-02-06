// create constants for current data in global scope
const currentTemp = document.getElementById("cityTemp");
const currentWind = document.getElementById("cityWind");
const currentHumid = document.getElementById("cityHumidity");
const currentUV = document.getElementById("cityUV");

// set const for button area div
const buttonSection = document.getElementById("button-area");

// Set empty date array
var currentDate = [];

// empty city object
var cities = [];

// search current weather API, and push response data to empty array.
var getRequestedPlace = function(event) {
  // prevent reload when submitting
  event.preventDefault()
  

  // get requested City
  var inputEl = document.getElementById("cityInput").value;
  var cityNameEl = document.getElementById("cityName");
  cityNameEl.innerHTML = inputEl;

  //send inputEl data to create button function
  recentHistoryButton(inputEl);

  // search API for requested city current weather
  const currentWeatherAPI = "https://api.openweathermap.org/data/2.5/weather?q=" + inputEl + "&units=imperial&appid=59801c8adee414a87d2a3fdb745b55e5"

  //fetch data from api and push to empty array
  fetch(currentWeatherAPI).then(function(response) {
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

          // send city name to array
          cityNameStorage(inputEl);
          
          // call UV index api function
          forecastWeather(data.coord.lat, data.coord.lon)

          // clear search bar value
          document.getElementById("cityInput").value = "";
          
      });
    } else {
      cityNameEl.innerHTML = "City";
      currentTemp.innerHTML = "Temp: ";
      currentWind.innerHTML = "Wind: ";
      currentHumid.innerHTML = "Humidity: ";
      currentUV.innerHTML = "UV Index: ";   
      currentUV.classList.remove("goodUV", "moderateUV", "badUV", "p-1", "round");
      inputEl = "";
      alert("There is no city with that name in our database.")
    }
  });
}

// create new button from search result
var recentHistoryButton = function(input) {
  // create button with new city name
  if (!input) {
  } else {
    var newButtons = document.createElement("button");
    newButtons.classList.add("col-12", "round", "gray", "mb-2", "mt-4");
    newButtons.setAttribute("id", input);
    newButtons.innerHTML += input;
    buttonSection.appendChild(newButtons);
  }
  
}

// Function to set forecast
var forecastWeather = function(lat, lon) {

  fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=59801c8adee414a87d2a3fdb745b55e5")

  .then(function (response) {
    if (response.ok) {
      response.json().then(function(data) {

        // set array for dates I want to pull from
        const fiveDayForecast = [
          data.daily[1],
          data.daily[2],
          data.daily[3],
          data.daily[4],
          data.daily[5]
        ];

        // clear forecast section
        document.getElementById("dailyForecast").innerHTML = "<h3 class='col-12'>5-Day Forecast:</h3>";

        fiveDayForecast.forEach(dailyForecastFunction);
        function dailyForecastFunction(item) {
          // covert UNIX time to local time
          const localTime = new Date(item.dt*1000);

          // dynamically generate container div and append it to 5-day forecast div
          const dailyDiv = document.createElement("div");
          dailyDiv.classList.add("card", "col-lg-2", "col-md-6", "my-2", "mx-auto", "pt-1");
          document.getElementById("dailyForecast").appendChild(dailyDiv);

          // dynamically generate content for container div
          const forecastDate = document.createElement("p");
          forecastDate.classList.add("text-nowrap", "h4")
          const forecastTemp = document.createElement("p");
          const forecastWind = document.createElement("p");
          const forecastHumid = document.createElement("p");

          forecastDate.innerHTML += localTime.getDate() + "/" + localTime.getMonth() + "/" + localTime.getFullYear();
          forecastTemp.innerHTML += "Temp: " + item.temp.max + "\xB0";
          forecastWind.innerHTML += "Wind: " + item.wind_speed + " MPH";
          forecastHumid.innerHTML += "Humidity: " + item.humidity + "%";

          // append elements to container div
          dailyDiv.appendChild(forecastDate);
          dailyDiv.appendChild(forecastTemp);
          dailyDiv.appendChild(forecastWind);
          dailyDiv.appendChild(forecastHumid);
        }
      
        currentDate.push(
          data.current.uvi
        );

        currentWeather();
      })
    }
    
  })
}

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
};

// save city names to local storage
function cityNameStorage(input) {
  
  if (localStorage.getItem("cityNames") === null) {
    cities = [];
    cities.push(input);
    var stringedCityNames = JSON.stringify(cities);
    localStorage.setItem("cityNames", stringedCityNames);
  } else {
    cities = JSON.parse(localStorage.getItem("cityNames"));
    while (cities.length > 6) {
      cities.splice(0,1);
    }
    console.log(cities);
    cities.push(input);
    var stringedCityNames = JSON.stringify(cities);
    localStorage.setItem("cityNames", stringedCityNames);
  }
}


// generate buttons from local storage
var cityButtons = function () {
  // retrieve data from local storage
  cities = JSON.parse(localStorage.getItem("cityNames"));

  if (localStorage.getItem("cityNames") === null) {

  } else {
    // create for loop to generate buttons.
    cities.forEach(buttonGenerator);
    function buttonGenerator(city) {
      var buttons = document.createElement("button");
      buttons.classList.add("col-12", "round", "gray", "mb-2", "mt-4");
      buttons.setAttribute("id", city);
      buttons.innerHTML += city;
      buttonSection.appendChild(buttons);
    }
  }
}

document.getElementById("search").addEventListener("click", getRequestedPlace);
cityButtons();


