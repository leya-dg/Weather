const apiKey = "ad7d0ff7878173ba32ebf7c829ea28b2";

const getWeatherBtn = document.getElementById("getWeather");
const cityInput = document.getElementById("city");
const weatherResult = document.getElementById("weatherResult");
const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const body = document.body;
const forecastDiv = document.getElementById("forecast");
const forecastCards = document.getElementById("forecastCards");

function clearWeatherAnimations() {
    document.querySelectorAll('.sun, .moon, .cloud, .raindrop, .snowflake, .star').forEach(el => el.remove());
}

getWeatherBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (!city) { alert("Please enter a city name"); return; }

    clearWeatherAnimations();

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(res => { if (!res.ok) throw new Error("City not found"); return res.json(); })
        .then(data => {
            cityName.textContent = `${data.name}, ${data.sys.country}`;
            temperature.textContent = `Temperature: ${data.main.temp}°C`;
            description.textContent = `Weather: ${data.weather[0].description}`;
            humidity.textContent = `Humidity: ${data.main.humidity}%`;

            const iconCode = data.weather[0].icon;
            weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            weatherIcon.alt = data.weather[0].description;

            const mainWeather = data.weather[0].main.toLowerCase();
            const hour = new Date().getHours();
            const isNight = hour < 6 || hour > 18;

            // animations
            if (mainWeather.includes("cloud")) {
                body.style.background = isNight ? "#2c3e50" : "#b0c4de";
                for(let i=0;i<3;i++){
                    let cloud = document.createElement("div");
                    cloud.classList.add("cloud");
                    cloud.style.top = `${20 + i*10}%`;
                    cloud.style.animationDelay = `${i*10}s`;
                    body.appendChild(cloud);
                }
            } else if (mainWeather.includes("rain")) {
                body.style.background = isNight ? "#34495e" : "#4682b4";
                for(let i=0;i<50;i++){
                    let drop = document.createElement("div");
                    drop.classList.add("raindrop");
                    drop.style.left = `${Math.random()*100}%`;
                    drop.style.animationDelay = `${Math.random()}s`;
                    body.appendChild(drop);
                }
            } else if (mainWeather.includes("clear")) {
                if(isNight){
                    body.style.background = "#1a1a2e";
                    for(let i=0;i<50;i++){
                        let star = document.createElement("div");
                        star.classList.add("star");
                        star.style.left = `${Math.random()*100}%`;
                        star.style.top = `${Math.random()*50}%`;
                        star.style.animationDuration = `${1+Math.random()*2}s`;
                        body.appendChild(star);
                    }
                    let moon = document.createElement("div");
                    moon.classList.add("moon");
                    body.appendChild(moon);
                } else {
                    body.style.background = "#87ceeb";
                    let sun = document.createElement("div");
                    sun.classList.add("sun");
                    body.appendChild(sun);
                }
            } else if(mainWeather.includes("snow")){
                body.style.background = isNight ? "#2c3e50" : "#f0f8ff";
                for(let i=0;i<50;i++){
                    let snow = document.createElement("div");
                    snow.classList.add("snowflake");
                    snow.style.left = `${Math.random()*100}%`;
                    snow.style.animationDelay = `${Math.random()*5}s`;
                    body.appendChild(snow);
                }
            } else if(mainWeather.includes("storm")){
                body.style.background = "#2f4f4f";
            } else {
                body.style.background = isNight ? "#1a1a2e" : "#87ceeb";
            }

            weatherResult.classList.remove("hidden");
        })
        .catch(err => { weatherResult.classList.add("hidden"); alert(err.message); });

    // 3-Day Forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    fetch(forecastUrl)
        .then(res => { if(!res.ok) throw new Error("Forecast not found"); return res.json(); })
        .then(forecastData => {
            forecastCards.innerHTML = "";
            for(let i=7; i<=23; i+=8){
                const day = forecastData.list[i];
                const date = new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
                const icon = day.weather[0].icon;
                const temp = day.main.temp;
                const desc = day.weather[0].main;

                const card = document.createElement("div");
                card.classList.add("forecast-card");
                card.innerHTML = `
                    <p>${date}</p>
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
                    <p>${temp}°C</p>
                    <p>${desc}</p>
                `;
                forecastCards.appendChild(card);
            }
            forecastDiv.classList.remove("hidden");
        })
        .catch(err => { forecastDiv.classList.add("hidden"); console.error(err); });
});
