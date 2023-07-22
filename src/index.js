let currentTemperature = document.querySelector("#temperature");
let weatherDescription = document.querySelector("#description");
let apiKey = "0479fec9478c6c9031d035f5c5efc126";

function showWeather(response) {
  let temperature = Math.round(response.data.main.temp);

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

  getForecast(response.data.coord);
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

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return days[day];
}

function showForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="forecast">`;

  forecast.forEach(function (day, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class = "day-container">
           <div><img src="http://openweathermap.org/img/wn/${
             day.weather[0].icon
           }.png" alt="" class="day-image"></div>
           <div>
             <span class="forecast-temperature-max forecast-temperature">${Math.round(
               day.temp.max
             )}°C</span>
             <span class="forecast-temperature-min forecast-temperature">${Math.round(
               day.temp.min
             )}°C</span>
           </div>
         </div>
       `;
      forecastHTML = forecastHTML + `</div>`;

      forecastElement.innerHTML = forecastHTML;
    }
  });
}

function getForecast(coordinates) {
  let apiKey = "0479fec9478c6c9031d035f5c5efc126";
  let apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

getCityWeather("Kyiv");
