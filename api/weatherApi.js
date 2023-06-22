import axios from "axios";

const apiKey = 'b6eca110bac440f99aa85450232106';
export const debounce = (func) => {
  let timer;
  return function (...args) {
    const context = this;
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      timer = null;
      func.apply(context, args);
    }, 500);
  };
};

const forecast = (params) =>
  `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=7&aqi=no&alerts=no`;
const autoCompLoc = (params) =>
  `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;

const apiCall = async (endpoint) => {
  const options = {
    method: "GET",
    url: endpoint,
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (err) {
    console.log("error: ", err);
  }
};

export const fetchWeatherForeCast = (params) => {
  return apiCall(forecast(params));
};
export const fetchLocation = (params) => {
  return apiCall(autoCompLoc(params));
};
