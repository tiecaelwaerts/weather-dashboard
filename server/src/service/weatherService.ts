import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
<<<<<<< HEAD
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

=======
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
>>>>>>> parent of 0f799c3 (updates to weatherservice)
class WeatherService {
  baseURL: string = process.env.API_BASE_URL as string;
  apiKey: string = process.env.API_KEY as string;
  cityName: string = '';
<<<<<<< HEAD

 private async fetchLocationData(query: string) {
    const response = await fetch(query);
    const locationData = await response.json();
    return locationData;
=======
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(query);
    const data = await response.json();
    if (data.length === 0) throw new Error('City not found');
    return data[0];
>>>>>>> parent of 0f799c3 (updates to weatherservice)
  }

  destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon,
    };
  }
<<<<<<< HEAD

=======
  // TODO: Create buildGeocodeQuery method
>>>>>>> parent of 0f799c3 (updates to weatherservice)
  private buildGeocodeQuery(): string {
    return `${this.baseURL}geo/1.0/direct?q=${this.cityName}&limit=5&appid=${this.apiKey}`;
  }
<<<<<<< HEAD

  private buildWeatherQuery(coordinates: Coordinates) {
    const currentWeather = `${this.baseURL}data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    const forecast = `${this.baseURL}data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    return { currentWeather, forecast };
=======
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly&units=metric&appid=${this.apiKey}`;
>>>>>>> parent of 0f799c3 (updates to weatherservice)
  }

  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
<<<<<<< HEAD

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
=======
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
>>>>>>> parent of 0f799c3 (updates to weatherservice)
      response.weather[0].description,
      response.main.temp,
      response.main.feels_like,
      response.main.humidity,
      response.wind.speed,
      response.weather[0].icon
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
<<<<<<< HEAD
    const weatherData = await this.fetchWeatherData(coordinates)
    const currentWeather = this.parseCurrentWeather(weatherData.currentWeatherData);
    const forecast = this.buildForecastArray(currentWeather, weatherData.forecastData.list);
    return forecast;
=======
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData.current);
    const forecastArray = this.buildForecastArray(weatherData.daily);
    return { currentWeather, forecast: forecastArray };
>>>>>>> parent of 0f799c3 (updates to weatherservice)
  }
}

export default new WeatherService();
