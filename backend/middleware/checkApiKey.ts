import { Request, Response, NextFunction } from 'express';

const checkApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    res.status(401).json({ error: 'Invalid or missing API key' });
    return;
  }

  next();
};

export default checkApiKey;
