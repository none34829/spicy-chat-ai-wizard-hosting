import express from 'express';
import { generateCharacter, getCharacterFromUrl } from '../controllers/characterController.js';
import { generateImage } from '../controllers/imageController.js';
import { Request, Response } from 'express';

const router = express.Router();

router.use((req, res, next) => {
  console.log(`API Request: ${req.method} ${req.originalUrl}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  next();
});

router.post('/character/generate', async (req: Request, res: Response) => {
  try {
    await generateCharacter(req, res);
  } catch (error) {
    console.error('Error in character/generate:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate character',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/character/extract', async (req: Request, res: Response) => {
  try {
    await getCharacterFromUrl(req, res);
  } catch (error) {
    console.error('Error in character/extract:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to extract character',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/image/generate', async (req: Request, res: Response) => {
  try {
    await generateImage(req, res);
  } catch (error) {
    console.error('Error in image/generate:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/health', (req, res) => {
  console.log('Health check endpoint hit');
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

router.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.status(200).json({ message: 'API is working' });
});

export { router as default };