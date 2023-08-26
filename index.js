const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;
  if (!urls) {
    return res.status(400).json({ error: 'No URLs provided' });
  }

  const urlArray = Array.isArray(urls) ? urls : [urls];

  const fetchPromises = urlArray.map(async (url) => {
    try {
      const response = await axios.get(url, { timeout:500 });
      return response.data.numbers || [1,2,3,4];
    } catch (error) {
      console.error(`Error fetching ${url}:`, error.message);
      return [];
    }
  });

  try {
    const results = await Promise.all(fetchPromises);
    const allNumbers = results.reduce((acc, numbers) => [...acc, ...numbers], []);
    const uniqueSortedNumbers = Array.from(new Set(allNumbers)).sort((a, b) => a - b);
    res.json({ numbers: uniqueSortedNumbers });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});