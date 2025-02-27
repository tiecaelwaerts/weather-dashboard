import { Router, Request, Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';


// TODO: POST Request with city name to retrieve weather data
  // TODO: GET weather data from city name
  // TODO: save city to search history
router.post('/', (req: Request, res: Response) => {
  try {
    const cityName  = req.body.cityName;
    WeatherService.getWeatherForCity(cityName).then((data)=> {
      HistoryService.addCity(cityName)
      res.json(data)
     })
  } catch (error) {
    console.log(error);
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const savedCities = await HistoryService.getCities();
    res.json(savedCities);
  } catch (error) {
    console.log(error);
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await HistoryService.deleteSearch(id);
    res.json({message: 'Search deleted successfully'});
  } catch (error) {
    res.status(500).json({error: 'failed to delete search'});
  }
});

export default router;
