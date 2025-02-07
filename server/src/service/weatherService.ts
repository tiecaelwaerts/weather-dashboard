import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public city: string,
    public country: string,
    public description: string,
    public temperature: number,
    public feelsLike: number,
    public humidity: number,
    public windSpeed: number,
    public icon: string
  ) {}
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL = 'https://api.openweathermap.org/data/2.5';
  private apiKey = process.env.WEATHER_API_KEY;
  private cityName: string = '';
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.length === 0) throw new Error('City not found');
    return data[0];
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }
  // TODO: Create buildGeocodeQuery method
  //private buildGeocodeQuery(query: string): string {
   // return `http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}`;
  //}
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly&units=metric&appid=${this.apiKey}`;
  }
  
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch weather data');
    return await response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
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
  async getWeatherForCity(city: string): Promise<{ currentWeather: Weather; forecast: any[] }> {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData.current);
    const forecastArray = this.buildForecastArray(weatherData.daily);
    return { currentWeather, forecast: forecastArray };
  }
}

export default new WeatherService();
