import dotenv from 'dotenv';
dotenv.config();


// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
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
    if (locationData.length === 0) throw new Error('City not found');
    return locationData[0];
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
  return `${this.baseURL}geo/1.0/direct?q=${this.cityName}&limit=5&appid=${this.apiKey}`
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates) {
    const currentWeather = `${this.baseURL}data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    const forecast = `${this.baseURL}data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    return {currentWeather, forecast };
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
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      this.cityName,
      new Date(response.dt * 1000).toDateString(),
      response.weather[0].icon,
      response.weather[0].description,
      response.main.temp,
      response.wind.speed,
      response.main.humidity
    );
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]) {
    const forecastArray = weatherData.map((data: any) => {
      return {
        date: new Date(data.dt * 1000),
        description: data.weather[0].description,
        temperature: data.temp.day,
        icon: data.weather[0].icon,
      };
    });
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData.currentWeatherData);
    const forecastArray = this.buildForecastArray(weatherData.forecastData.daily);
    return { currentWeather, forecast: forecastArray };
  }
}

export default new WeatherService();
