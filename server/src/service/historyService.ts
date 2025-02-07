import * as fs from 'fs/promises';

// TODO: Define a City class with name and id properties
class City {
  constructor(public name: string, public id: string) {}
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile('searchHistory.json', 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    await fs.writeFile('searchHistory.json', JSON.stringify(cities), 'utf-8');
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string): Promise<City> {
    const cities = await this.read();
    const newCity = new City(Date.now().toString(), city);
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<boolean> {
    const cities = await this.read();
    const updatedCities = cities.filter((city) => city.id !== id);
    if (cities.length === updatedCities.length) return false;
    await this.write(updatedCities);
    return true;
  }
  async saveSearch(city: string): Promise<void> {
    const service = new HistoryService();
    await service.addCity(city);
  }
  async deleteSearch(id: string): Promise<void> {
    const service = new HistoryService();
    await service.removeCity(id);
  }
  async getSearchHistory() {
    const service = new HistoryService();
    return await service.getCities();
  }
}

export default new HistoryService();
