import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

const SERPAPI_KEY = "f9d335435322c61cf8bfca2e2dcff5028d6123730904efdefef44f62bde5516f"; // Paste your actual key here

app.get('/api/jobs', async (req, res) => {
  try {
    const { q, location } = req.query;
    const url = `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(
      q || "developer"
    )}&location=${encodeURIComponent(location || "India")}&hl=en&gl=in&api_key=${SERPAPI_KEY}`;

    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Proxy running at http://localhost:5000'));