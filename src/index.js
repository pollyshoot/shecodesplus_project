let currentTemperature = document.querySelector("#temperature");
let weatherDescription = document.querySelector("#description");
let apiKey = "0479fec9478c6c9031d035f5c5efc126";

function showWeather(response) {
  celsiusTemperature = response.data.main.temp;

  let temperature = Math.round(celsiusTemperature);

  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon.setAttribute("alt", `${response.data.weather[0].description}`);

  currentTemperature.innerHTML = temperature;
  weatherDescription.innerHTML = response.data.weather[0].main;
  document.querySelector(
    "#humidity"
  ).innerHTML = `Humidity: ${response.data.main.humidity}%`;
  document.querySelector("#wind").innerHTML = `Wind: ${Math.round(
    response.data.wind.speed
  )}km/h`;
  console.log(response.data);

  let timeApiKey = "538eeab30025432fbe053ba84bb1ad3a";
  let latitude = response.data.coord.lat;
  let longitude = response.data.coord.lon;
  let timeApiUrl = `https://api.ipgeolocation.io/timezone?apiKey=${timeApiKey}&lat=${latitude}&long=${longitude}`;

  function showTime(response) {
    let time = document.querySelector("#time");
    time.innerHTML = response.data.date_time_txt;
  }

  document.querySelector("#current-city").innerHTML = response.data.name;

  axios.get(timeApiUrl).then(showTime);
}

function getCityWeather(city) {
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = searchInput.value;
  getCityWeather(city);
}
let searchInput = document.querySelector("#search-input");

let search = document.querySelector("#search");

search.addEventListener("submit", handleSubmit);

function currentLocationWeather(position) {
  let units = "metric";
  let currentLocationUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;

  axios.get(currentLocationUrl).then(showWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentLocationWeather);
}

let currentCityButton = document.querySelector("#current-city-btn");
currentCityButton.addEventListener("click", getCurrentLocation);


let celsiusTemperature = null;


function toFahrenheit(event) {
  event.preventDefault();

  let temperature = document.querySelector("#temperature");
  let temperatureToFahrenheit = (celsiusTemperature * 9) / 5 + 32;
  temperature.innerHTML = Math.round(temperatureToFahrenheit);
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}


let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", toFahrenheit);


function toCelsius(event) {
  event.preventDefault();

  let temperature = document.querySelector("#temperature");
  temperature.innerHTML = Math.round(celsiusTemperature);
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", toCelsius);


getCityWeather("Kyiv");
