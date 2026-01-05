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

const forecastitemscontainer = document.querySelector(
  ".forecast-items-container"
);

searchbtn.addEventListener("click", () => {
  if (cityinput.value.trim() != "") {
    updateweatherinfo(cityinput.value);
    cityinput.value = "";
    cityinput.blur();
  }
});
cityinput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && cityinput.value.trim() != "") {
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
function getweathericon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
}
function getcurrentdate() {
  const currentdate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return currentdate.toLocaleDateString("en-GB", options);
}
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
  currentdatetxt.textContent = getcurrentdate();
  weathersummaryimg.src = `/assets/assets/weather/${getweathericon(id)}`;

  await updateforecastsinfo(city);
  showdisplaysection(weatherinfo);
}
async function updateforecastsinfo(city) {
  const forecastsdata = await getFetchData("forecast", city);

  const timetaken = "12:00:00";
  const todaydate = new Date().toISOString().split("T")[0];

  forecastitemscontainer.innerHTML = ``;

  forecastsdata.list.forEach((forecastweather) => {
    if (
      forecastweather.dt_txt.includes(timetaken) &&
      !forecastweather.dt_txt.includes(todaydate)
    ) {
      updateforecastsitems(forecastweather);
    }
  });
}
function updateforecastsitems(weatherdata) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherdata;
  const datetaken = new Date(date);
  const dateoption = {
    day: "2-digit",
    month: "short",
  };
  const dateresult = datetaken.toLocaleDateString("en-US", dateoption);
  const forecastitem = `
   <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateresult}</h5>
            <img
              src="/assets/assets/weather/${getweathericon(id)}"
              class="forecast-item-img"
            />
            <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
          </div>`;
  forecastitemscontainer.insertAdjacentHTML("beforeend", forecastitem);
}
function showdisplaysection(section) {
  [weatherinfo, searchcitysection, notfoundsection].forEach(
    (section) => (section.style.display = "none")
  );
  section.style.display = "flex";
}
