// create variables for current data in global scope
var currentTemp = document.getElementById("cityTemp");
var currentWind = document.getElementById("cityWind");
var currentHumid = document.getElementById("cityHumidity");
var currentUV = document.getElementById("cityUV");

// Set empty array
var currentDate = [];

// search current weather API, and push response data to empty array.
var getRequestedPlace = function(event) {
  // prevent reload when submitting
  event.preventDefault()

  // get requested City
  var inputEl = document.getElementById("cityInput");
  var cityNameEl = document.getElementById("cityName");
  cityNameEl.innerHTML = inputEl.value;

  // send city name to local storage
  function cityNameStorage() {
    localStorage.setItem(inputEl.value);
    console.log(localStorage);
  }

  // search API for requested city current weather
  var currentWeatherAPI = "https://api.openweathermap.org/data/2.5/weather?q=" + inputEl.value + "&units=imperial&appid=59801c8adee414a87d2a3fdb745b55e5"

  //fetch data and push to empty array
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

          // clear search bar value
          inputEl.value = "";

          // call UV index api function
          forecastWeather(data.coord.lat, data.coord.lon)
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
      
        const timeStamp = data.daily[1].dt
        const date = new Date(timeStamp*1000);
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

}



document.getElementById("search").addEventListener("click", getRequestedPlace);


