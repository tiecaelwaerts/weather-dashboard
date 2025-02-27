import fs from 'fs/promises';

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name,
    this.id = id
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    try {
      const data = await fs.readFile('searchHistory.json', 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile('searchHistory.json', JSON.stringify(cities, null, '/t'));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read().then((cities) => {
      let parsedCities: City[];

      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      }

      return parsedCities;
    });
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities = await this.read();
    const newCity = new City(Date.now().toString(), city);
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<boolean> {
    const cities = await this.read();
    const updatedCities = cities.filter((city: City) => city.id !== id);
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
