import dotenv from 'dotenv';
import express, { urlencoded } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files of the client dist folder
app.use(express.static(path.join(__dirname, '../../../client/dist')));

// Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(urlencoded({ extended: true }));

// Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
