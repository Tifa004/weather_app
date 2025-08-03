import "./styles.css";

const search = document.querySelector('#search_bar');
const today = document.getElementById('today')
const rest=document.getElementById('week')
const toggle=document.querySelector('.convert');

let currentUnit = 'F';

// const svgs ={
//   'clear-day':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 57.47 57.47"><defs><style>.cls-1,.cls-2{fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:3px;}.cls-1{stroke-linecap:round;}</style></defs><title>clear-dayAsset 68</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><line class="cls-1" x1="8.55" y1="28.73" x2="1.5" y2="28.73"/><line class="cls-1" x1="14.15" y1="42.85" x2="9.07" y2="47.75"/><line class="cls-1" x1="14.75" y1="14.28" x2="9.82" y2="9.24"/><line class="cls-1" x1="10.03" y1="36.46" x2="3.51" y2="39.14"/><line class="cls-1" x1="21.11" y1="10.12" x2="18.39" y2="3.62"/><line class="cls-1" x1="20.57" y1="47.38" x2="17.75" y2="53.85"/><line class="cls-1" x1="10.25" y1="20.74" x2="3.78" y2="17.95"/><path class="cls-2" d="M28.7,43.71h0a14.86,14.86,0,1,0,0-29.71h.05a14.86,14.86,0,1,0,0,29.71H28.7Z"/><line class="cls-1" x1="48.92" y1="28.73" x2="55.97" y2="28.73"/><line class="cls-1" x1="28.73" y1="8.55" x2="28.73" y2="1.5"/><line class="cls-1" x1="28.73" y1="48.92" x2="28.73" y2="55.97"/><line class="cls-1" x1="43.32" y1="42.85" x2="48.39" y2="47.75"/><line class="cls-1" x1="42.72" y1="14.28" x2="47.65" y2="9.24"/><line class="cls-1" x1="47.44" y1="36.46" x2="53.96" y2="39.14"/><line class="cls-1" x1="36.36" y1="10.12" x2="39.08" y2="3.62"/><line class="cls-1" x1="36.89" y1="47.38" x2="39.72" y2="53.85"/><line class="cls-1" x1="47.21" y1="20.74" x2="53.69" y2="17.95"/></g></g></svg>',
//   'clear-night':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 39.11 40.96"><defs><style>.cls-1{fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:3px;}</style></defs><title>clear-nightAsset 69</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M30.56,34.05h0a13.57,13.57,0,1,1,0-27.13,13.79,13.79,0,0,1,3.71.52,19,19,0,1,0-13.79,32h0a18.94,18.94,0,0,0,13.78-5.94A14.15,14.15,0,0,1,30.56,34.05Z"/></g></g></svg>',
//   'cloudy':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98.7 34.32"><defs><style>.cls-1{fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:3px;}</style></defs><title>cloudyAsset 72</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M59.26,31.64H97.15a15.06,15.06,0,0,0-12.1-14.06,15.87,15.87,0,0,0-7.62.47c-1.76.56-2.5.2-3.26-1.52a15.1,15.1,0,0,0-14.88-9.1A14.82,14.82,0,0,0,52,9.93c-1.62,1.06-2.55.86-3.63-.79a16.47,16.47,0,0,0-30.13,6.18c-.53,3.41-1.13,3.15-3.77,3.45-12.16,0-13,12.67-12.95,12.87H39.61"/><path d="M49.24,34.32a2.64,2.64,0,0,1-2.7-2.73,2.71,2.71,0,0,1,5.41,0A2.65,2.65,0,0,1,49.24,34.32Z"/></g></g></svg>',
//   'fog':
// }
async function getWeather(location) {
  const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=YLMAK26BJ2F3CVEXDE5FDU6U5&contentType=json`,{mode:'cors'})
  const searchData = await response.json();
  return searchData.days
}

function convertUnits(array, unit) {
  return array.map(day => {
    const newDay = { ...day }; 

    if (unit === 'C') {
      newDay.temp = ((newDay.temp - 32) * 5) / 9;
      newDay.tempmin = ((newDay.tempmin - 32) * 5) / 9;
      newDay.tempmax = ((newDay.tempmax - 32) * 5) / 9;
    } else {
      newDay.temp = (newDay.temp * 9) / 5 + 32;
      newDay.tempmin = (newDay.tempmin * 9) / 5 + 32;
      newDay.tempmax = (newDay.tempmax * 9) / 5 + 32;
    }

    newDay.temp = Math.round(newDay.temp * 10) / 10;
    newDay.tempmin = Math.round(newDay.tempmin * 10) / 10;
    newDay.tempmax = Math.round(newDay.tempmax * 10) / 10;

    return newDay;
  });
}

async function getSvgIcon(conditions){
  const response = await fetch(`https://raw.githubusercontent.com/VisualCrossing/WeatherIcons/main/SVG/4th%20Set%20-%20Monochrome/${conditions}.svg`,{mode:'cors'});
  const icon = await response.text();
  return icon
}
async function renderWeatherInfo(week) {

  const todayIconRaw = await getSvgIcon(week[0].icon);
  const todayIcon = todayIconRaw.replace(/<style[\s\S]*?<\/style>/gi, '');

  today.innerHTML = `
    <div class="weather-today">
      <div class="weather-icon">${todayIcon}</div>
      <div class="weather-info">
        <div class="temp-main">
          ${week[0].temp}<span style="font-size: 0.6em;"> °${currentUnit}</span>
        </div>
        <div class="temp-range">
          H: ${week[0].tempmax}<span style="font-size: 0.7em; opacity: 0.7;"> °${currentUnit}</span> /
          L: ${week[0].tempmin}<span style="font-size: 0.7em; opacity: 0.7;"> °${currentUnit}</span>
        </div>
        <div class="condition">${week[0].conditions}</div>
        <div class="date">${week[0].datetime}</div>
      </div>
    </div>
  `;

  rest.innerHTML = '';

  const dayCards = await Promise.all(
    week.slice(1).map(async (day) => {
      const iconRaw = await getSvgIcon(day.icon);
      const cleanedIcon = iconRaw.replace(/<style[\s\S]*?<\/style>/gi, '');

      return `
        <div class="weather-card">
          <div class="weather-icon-sm">${cleanedIcon}</div>
          <div class="weather-details-sm">
            <div class="temp-sm">
              ${day.temp}<span style="font-size: 0.6em; opacity: 0.7;">°${currentUnit}</span>
            </div>
            <div class="date-sm">${day.datetime}</div>
          </div>
        </div>
      `;
    })
  );

  rest.innerHTML = dayCards.join('');
}

toggle.addEventListener('change', () => {
  currentUnit = toggle.checked ? 'C' : 'F';
  const event = new KeyboardEvent('keydown', {key: 'Enter'});
  search.dispatchEvent(event);
});

search.addEventListener('keydown',(e)=>{
  if(e.key=='Enter'){
    if(search.value.trim()){
    getWeather(search.value).then( days =>{
      const sortedDays = days.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
      const forecast=currentUnit==='F'?sortedDays.slice(0,7):convertUnits(sortedDays.slice(0,7),currentUnit);
      console.log(forecast)
      renderWeatherInfo(forecast);
    }).catch(err => {
        alert("Unable to retrieve weather. Please check the location and try again.");
});
  }
  }
})
