import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';


// TODO: POST Request with city name to retrieve weather data
  // TODO: GET weather data from city name
  // TODO: save city to search history
router.post('/', async (req, res) => {
  try {
    const { city } = req.body;
    if (!city) {
      return res.status(400).json({ message: 'City name is required' });
    }

    const weatherData = await WeatherService.getWeatherForCity(city);
    await HistoryService.saveSearch(city);

    return res.json({weather: weatherData, message: 'Weather data retrieved successfully'});
  } catch (error) {
    return res.status(500).json({error: 'failed to retrieve weather data'});
  }
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const history = await HistoryService.getSearchHistory();
    res.json(history);
  } catch (error) {
    res.status(500).json({error: 'failed to retrieve search history'});
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await HistoryService.deleteSearch(id);
    res.json({message: 'Search deleted successfully'});
  } catch (error) {
    res.status(500).json({error: 'failed to delete search'});
  }
});

export default router;
