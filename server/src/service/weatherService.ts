import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lon: number,
  lat: number
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number

  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number) {
    this.city = city,
    this.date = date,
    this.icon = icon,
    this.iconDescription = iconDescription,
    this.tempF = tempF,
    this.windSpeed = windSpeed,
    this.humidity = humidity
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL: string = process.env.API_BASE_URL as string;
  apiKey: string = process.env.API_KEY as string;
  cityName: string = '';

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    const locationData = await response.json();
    return locationData;
  }
    
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return { lon: locationData[0].lon, lat: locationData[0].lat }
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
     return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=5&appid=${this.apiKey}`
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates) {
    const currentWeather = `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    const forecast = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    return { currentWeather, forecast };
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const currentWeatherResponse = await fetch(query.currentWeather);
    const forecastResponse = await fetch(query.forecast);
    const currentWeatherData = await currentWeatherResponse.json();
    const forecastData = await forecastResponse.json();
    return { currentWeatherData, forecastData };
  }

  // TODO: Build parseCurrentWeather method
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

  // TODO: Complete buildForecastArray method
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

  // TODO: Complete getWeatherForCity method
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