const container = document.querySelector('.container');
const searchBtn = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404  = document.querySelector('.not-found');
const cityhide = document.querySelector('.city-hide');
const cityInput = document.querySelector('.search-box input');
const locationBtn = document.querySelector('.get-location'); // 📍 Location button

const APIKey = '3cbbea99318de55b1bb810a1f2f4eb53'; // Replace with your OpenWeatherMap API key

// Fetch by city name
function fetchWeatherByCity(city) {
  if (!city) return;

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
    .then(res => res.json())
    .then(json => updateWeatherUI(json, city))
    .catch(() => showError());
}

// Fetch by coordinates
function fetchWeatherByCoords(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`)
    .then(res => res.json())
    .then(json => updateWeatherUI(json))
    .catch(() => showError());
}

// Update the UI
function updateWeatherUI(json, city = '') {
  if (json.cod === '404' || json.cod === 404) {
    cityhide.textContent = city;
    container.style.height = '400px';
    weatherBox.classList.remove('active');
    weatherDetails.classList.remove('active');
    error404.classList.add('active');
    return;
  }

  const image = document.querySelector('.weather-box img');
  const temperature = document.querySelector('.weather-box .temperature');
  const description = document.querySelector('.weather-box .description');
  const humidity = document.querySelector('.weather-details .humidity span');
  const wind = document.querySelector('.weather-details .wind span');

  // Avoid duplicate request
  if (city && cityhide.textContent === city) return;
  if (city) cityhide.textContent = city;

  const weather = json.weather[0].main;
  switch (weather) {
    case 'Clear': image.src = 'images/clear.png'; break;
    case 'Rain': image.src = 'images/rain.png'; break;
    case 'Snow': image.src = 'images/snow.png'; break;
    case 'Clouds': image.src = 'images/cloud.png'; break;
    case 'Mist':
    case 'Fog': image.src = 'images/mist.png'; break;
    case 'Haze': image.src = 'images/haze.png'; break;
    default: image.src = 'images/cloud.png';
  }

  temperature.innerHTML = `${Math.round(json.main.temp)}<span>°C</span>`;
  description.textContent = json.weather[0].description;
  humidity.textContent = `${json.main.humidity}%`;
  wind.textContent = `${Math.round(json.wind.speed)} km/h`;

  container.style.height = '555px';
  container.classList.add('active');
  weatherBox.classList.add('active');
  weatherDetails.classList.add('active');
  error404.classList.remove('active');

  setTimeout(() => container.classList.remove('active'), 2500);
}

// Show error UI
function showError() {
  container.style.height = '400px';
  weatherBox.classList.remove('active');
  weatherDetails.classList.remove('active');
  error404.classList.add('active');
}

// Search button click
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  fetchWeatherByCity(city);
});

// Allow Enter key
cityInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') searchBtn.click();
});

// 📍 Clickable Location button
locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoords(lat, lon);
      },
      (error) => {
        alert("Location access denied! Please allow GPS permission.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});
