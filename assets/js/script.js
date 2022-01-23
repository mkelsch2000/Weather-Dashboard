var cityNameEl = document.getElementById("cityName");
var cityInputEl = document.getElementById("cityInput");

var searchInput = function(event) {
  event.preventDefault()
  var inputEl = cityInputEl.value;
  cityNameEl.innerHTML = inputEl;

  if (inputEl === "") {
    cityNameEl.innerHTML = "City";
  }

  getRequestedPlace(inputEl);
}

var getRequestedPlace = function(inputEl) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + inputEl + "&appid=59801c8adee414a87d2a3fdb745b55e5"

  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        console.log(data);
        cityInputEl.value = "";
      });
    } else {
      cityNameEl.innerHTML = "City";
      cityInputEl.value = "";
      alert("There is no city with that name in our database.")
    }
  });
}

document.getElementById("search").addEventListener("click", searchInput);


