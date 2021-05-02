const sunriseElem = document.querySelectorAll(".sunrise span")[0];
const sunsetElem = document.querySelectorAll(".sunrise span")[1];
const noInternetElem = document.querySelector("p#no-internet");
const cityNameElem = document.querySelector("span.city_name");
const countryNameElem = document.querySelector("span.country_name");
const weatherElem = document.querySelector("span.wd");
const infoElem = document.querySelector("span.info");
const statusElem = document.querySelector("span.status");
const descElem = document.querySelector("small.desc");
const iconElem = document.querySelector(".icon");
const sunnyUrl = `https://images.pexels.com/photos/3768/sky-sunny-clouds-cloudy.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`;
const cloudyUrl = `https://images.pexels.com/photos/5341778/pexels-photo-5341778.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`;
const rainyUrl = `https://images.pexels.com/photos/125510/pexels-photo-125510.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`;
const root = document.querySelector(":root");
const loading = document.querySelector(".loading");

const icons = {
  cloudy: `<i class="fas fa-cloud"></i>`,
  rainy: `<i class="fas fa-cloud-rain"></i>`,
  sunny: `<i class="fas fa-sun animated"></i>`,
};

// get icon
function updateUI(status) {
  if (status === "Clear") {
    iconElem.innerHTML = icons.sunny;
    setBg(sunnyUrl);
  } else if (status === "Clouds") {
    iconElem.innerHTML = icons.cloudy;
    setBg(cloudyUrl);
  } else {
    iconElem.innerHTML = icons.rainy;
    setBg(rainyUrl);
  }
}

// get weather data
async function getWeather(long, latt) {
  const apiUrl = `https://weather-proxy.freecodecamp.rocks/api`;
  const resp = await fetch(`${apiUrl}/current?lon=${+long}&lat=${+latt}`);
  return await resp.json();
}

// set background upon weather
function setBg(bgUrl) {
  root.style.setProperty("--bg-img", `url(${bgUrl})`);
}

// user location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    const long = position.coords.longitude;
    const latt = position.coords.latitude;

    getWeather(long, latt).then((weather) => {
      const {
        name: cityName,
        sys: { country, sunrise, sunset },
      } = weather;
      const status = weather.weather[0].main;
      const desc = weather.weather[0].description;
      const temp = weather.main;
      let option = "C";

      const sunriseTime = getTime(sunrise);
      const sunsetTime = getTime(sunset);

      // remove the loading and set up data
      loading.remove();
      updateText(statusElem, status);
      updateText(cityNameElem, cityName + ", ");
      updateText(countryNameElem, country);
      updateText(descElem, desc);
      updateText(weatherElem, Math.round(temp.temp * 10) / 10);
      updateText(infoElem, option);
      updateText(sunriseElem, `${sunriseTime}AM`);
      updateText(sunsetElem, `${sunsetTime}PM`);

      // toggle fahren | cel
      infoElem.addEventListener("click", () => {
        if (option === "C") {
          option = "F";
          updateText(weatherElem, fahrenheit(temp.temp));
        } else {
          option = "C";
          updateText(weatherElem, Math.round(temp.temp * 10) / 10);
        }
        updateText(infoElem, option);
      });

      updateUI(status);
    });
  });
}

function updateText(elem, text) {
  if (elem) elem.textContent = text;
}

function fahrenheit(cel) {
  return Math.round((cel * 9) / 5 + 32);
}

function isOnline() {
  return navigator.onLine === true;
}

window.addEventListener("online", () => {
  if (isOnline()) {
    noInternetElem.remove();
  }
});
window.addEventListener("offline", () => {
  if (isOnline()) {
    noInternetElem.remove();
  }
});

function getTime(seconds) {
  const date = new Date(seconds * 1000);
  let hours = date.getHours();
  hours = hours > 12 ? hours % 12 : hours;
  const result = `${hours.toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  return result;
}
