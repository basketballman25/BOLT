const https = require('https');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const q = encodeURIComponent((req.query.q || '') + ' lyrics');
  
  https.get({
    hostname: 'www.youtube.com',
    path: `/results?search_query=${q}`,
    headers: { 
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  }, r => {
    let data = '';
    r.on('data', c => data += c);
    r.on('end', () => {
      // Get multiple video IDs and return the first few
      const matches = [...data.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)];
      const ids = [...new Set(matches.map(m => m[1]))].slice(0, 5);
      
      if (ids.length > 0) {
        res.json({ videoId: ids[0], alternatives: ids.slice(1) });
      } else {
        res.status(404).json({ error: 'not found' });
      }
    });
  }).on('error', (e) => {
    res.status(500).json({ error: 'failed', message: e.message });
  });
};
