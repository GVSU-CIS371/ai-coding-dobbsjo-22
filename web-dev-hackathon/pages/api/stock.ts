// pages/api/stock.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { symbol } = req.query;
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
    );
    const data = await response.json();

    // Finnhub returns 0 for prices if the symbol is invalid
    if (data.c === 0) {
      return res.status(404).json({ error: 'Symbol not found' });
    }

    // Map the response to cleaner names for your Vue frontend
    res.status(200).json({
      symbol,
      price: data.c,      // Current price
      high: data.h,       // High price of the day
      low: data.l,        // Low price of the day
      open: data.o,       // Open price of the day
      prevClose: data.pc, // Previous close price
      change: data.d,     // Price change
      percentChange: data.dp // Percent change
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
}