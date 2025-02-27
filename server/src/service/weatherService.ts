import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
  city: string;
  country: string;
  description: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  icon: string;

  constructor(
    city: string,
    country: string,
    description: string,
    temperature: number,
    feelsLike: number,
    humidity: number,
    windSpeed: number,
    icon: string
  ) {
    this.city = city;
    this.country = country;
    this.description = description;
    this.temperature = temperature;
    this.feelsLike = feelsLike;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.icon = icon;
  }
}

class WeatherService {
  baseURL: string = process.env.API_BASE_URL as string;
  apiKey: string = process.env.API_KEY as string;
  cityName: string = '';

  async fetchLocationData(query: string) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.length === 0) throw new Error('City not found');
    return data[0];
  }

  destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }

  private buildGeocodeQuery(query: string): string {
    return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
  }

  private buildWeatherQuery(coordinates: Coordinates) {
    return {
      currentWeather: `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`,
      forecast: `${this.baseURL}/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly&units=imperial&appid=${this.apiKey}`,
    };
  }

  async fetchAndDestructureLocationData(city: string) {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }

  async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const currentWeatherResponse = await fetch(query.currentWeather);
    const forecastResponse = await fetch(query.forecast);
    if (!currentWeatherResponse.ok || !forecastResponse.ok)
      throw new Error('Failed to fetch weather data');
    const currentWeatherData = await currentWeatherResponse.json();
    const forecastData = await forecastResponse.json();
    return { currentWeatherData, forecastData };
  }

  parseCurrentWeather(response: any): Weather {
    return new Weather(
      this.cityName,
      response.sys.country,
      response.weather[0].description,
      response.main.temp,
      response.main.feels_like,
      response.main.humidity,
      response.wind.speed,
      response.weather[0].icon
    );
  }

  buildForecastArray(weatherData: any[]) {
    const forecastArray = weatherData.map((data: any) => {
      return {
        date: new Date(data.dt * 1000).toDateString(),
        description: data.weather[0].description,
        temperature: data.temp.day,
        icon: data.weather[0].icon,
      };
    });
    return forecastArray;
  }

  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData.currentWeatherData);
    const forecastArray = this.buildForecastArray(weatherData.forecastData.daily);
    return { currentWeather, forecast: forecastArray };
  }
}

export default new WeatherService();
