# 🌤️ SkyWhiz — Weather Forecast App

A sleek, responsive weather app that fetches 7-day forecasts using the [Visual Crossing Weather API](https://www.visualcrossing.com/), displays inline SVG weather icons, and allows live temperature unit toggling between Fahrenheit and Celsius.

## 🔍 Features

- 🔎 Search weather by location (country or city)
- 🌦️ Displays today's weather with:
  - SVG weather icons
  - Temperature, high/low, condition, and date
- 📆 Shows 6-day forecast as weather cards
- 🌡️ Toggle switch to change between °F and °C
- 📱 Responsive design — mobile-friendly layout
- ⚡ Instant feedback with `Enter` key search trigger

## 🧪 Technologies Used

- **HTML, CSS, JavaScript (ES6+)**
- **Fetch API** for data and SVG icon retrieval
- **Async/Await** for asynchronous operations
- **DOM Manipulation** via `innerHTML`, `querySelector`, etc.
- **CORS** mode handling
- **Media Queries** for responsive styling
- **Custom CSS toggle switch**
- **SVG sanitization** using regex to remove `<style>` tags

## 🚀 How It Works

1. On typing a location and pressing `Enter`, a request is sent to Visual Crossing's API.
2. Today's weather is rendered using sanitized inline SVGs.
3. The next 6 days are shown in a forecast card layout.
4. Toggling the unit switch re-converts temperatures and re-renders the UI.

## 📦 Notes

- Temperature conversion is handled manually using the `convertUnits()` function.
- Weather icons are fetched from GitHub-hosted SVGs and styled dynamically.
- Error handling is in place for invalid location inputs.
