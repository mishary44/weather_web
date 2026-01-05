const cityinput = document.querySelector(".city-input");
const searchbtn = document.querySelector(".search-btn");
const apikey = "fa1a7b89791a57a4e90d0c61c2f5a2ba";

const notfoundsection = document.querySelector(".not-found");
const weatherinfo = document.querySelector(".weather-info");
const searchcitysection = document.querySelector(".search-city");

const countrytxt = document.querySelector(".country-txt");
const temptxt = document.querySelector(".temp-txt");
const conditiontxt = document.querySelector(".condition-txt");
const humidityvaluetxt = document.querySelector(".humidity-value-txt");
const windvaluetxt = document.querySelector(".wind-value-txt");
const weathersummaryimg = document.querySelector(".weather-summary-img");
const currentdatetxt = document.querySelector(".current-date-txt");

searchbtn.addEventListener("click", () => {
  if (cityinput.value.trim() != "") {
    updateweatherinfo(cityinput.value);
    cityinput.value = "";
    cityinput.blur();
  }
});
cityinput.addEventListener("keydown", (event) => {
  if (event.key == "enter" && cityinput.value.trim() != "") {
    updateweatherinfo(cityinput.value);
    cityinput.value = "";
    cityinput.blur();
  }
});
async function getFetchData(endpoint, city) {
  const apiurl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apikey}&units=metric`;
  const response = await fetch(apiurl);
  return response.json();
}
function getweathericon() {}
async function updateweatherinfo(city) {
  const weatherData = await getFetchData("weather", city);
  if (weatherData.cod != 200) {
    showdisplaysection(notfoundsection);
    return;
  }
  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;
  countrytxt.textContent = country;
  temptxt.textContent = Math.round(temp) + "°C";
  conditiontxt.textContent = main;
  humidityvaluetxt.textContent = humidity + "%";
  windvaluetxt.textContent = speed + "M/s";
  weathersummaryimg.src = `/assets/assets/weather/${getweathericon(id)}`;

  showdisplaysection(weatherinfo);
}
function showdisplaysection(section) {
  [weatherinfo, searchcitysection, notfoundsection].forEach(
    (section) => (section.style.display = "none")
  );
  section.style.display = "flex";
}
