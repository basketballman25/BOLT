const https = require('https');

module.exports = (req, res) => {
  const q = encodeURIComponent((req.query.q || '') + ' official');
  https.get({
    hostname: 'www.youtube.com',
    path: `/results?search_query=${q}`,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  }, r => {
    let data = '';
    r.on('data', c => data += c);
    r.on('end', () => {
      const match = data.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
      if (match) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ videoId: match[1] });
      } else {
        res.status(404).json({ error: 'not found' });
      }
    });
  }).on('error', () => res.status(500).json({ error: 'failed' }));
};
