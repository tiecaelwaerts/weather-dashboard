import path from 'path';
import { fileURLToPath } from 'url';
import { Router, Request, Response } from 'express';
const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define route to serve index.html
router.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../../client/dist/index.html'));
});

export default router;
