import dotenv from 'dotenv';
import express, { urlencoded } from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files of the client dist folder
app.use(express.static('../client/dist'));

// Implement middleware for parsing JSON and urlencoded form datadleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(urlencoded({ extended: true }));

// Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
