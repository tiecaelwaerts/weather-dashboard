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
