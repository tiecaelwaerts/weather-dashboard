import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ) 
 {
    this.city = city,
    this.date = date,
    this.icon = icon,
    this.iconDescription = iconDescription,
    this.tempF = tempF,
    this.windSpeed = windSpeed,
    this.humidity = humidity
  }
}

class WeatherService {
  baseURL: string;
  apiKey: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || "";
    this.apiKey = process.env.API_KEY || "";
  }

 private async fetchLocationData(query: string) {
    const response = await fetch(query);
    const locationData = await response.json();
    return locationData;
  }

  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon,
    };
  }
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=5&appid=${this.apiKey}`;
  }

  private buildWeatherQuery(coordinates: Coordinates) {
    const currentWeather = `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    const forecast = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    return { currentWeather, forecast };
  }

  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const currentWeatherResponse = await fetch(query.currentWeather);
    const forecastResponse = await fetch(query.forecast);
    const currentWeatherData = await currentWeatherResponse.json();
    const forecastData = await forecastResponse.json();
    return { currentWeatherData, forecastData };
  }

  private parseCurrentWeather(response: any) {
    const currentDate = new Date((response.dt + response.timezone) * 1000);
    const data = new Weather (
      response.name,
      `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`,
      response.weather[0].icon,
      response.weather[0].description,
      response.main.temp,
      response.wind.speed,
      response.main.humidity
    );
    return data;
  }

  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = [];
    forecastArray.push(currentWeather);
   
    const forecast = weatherData.filter((day) => day.dt_txt.includes('12:00:00'));
    forecast.forEach((day) => {
      const data = new Weather (
        currentWeather.city,
        day.dt_txt.split(' ')[0],
        day.weather[0].icon,
        day.weather[0].description,
        day.main.temp,
        day.wind.speed,
        day.main.humidity
      );
      forecastArray.push(data);
    });
    return forecastArray;
  }

  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates)
    const currentWeather = this.parseCurrentWeather(weatherData.currentWeatherData);
    const forecast = this.buildForecastArray(currentWeather, weatherData.forecastData.list);
    return forecast;
  }
}

export default new WeatherService();