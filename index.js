require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }))

app.use('/public', express.static(`${process.cwd()}/public`));

/* Connection to Database */
const database = require('./database.js')

/* Schemas */
const Url = require('./models/Url.js');

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', async (req, res) => {
  const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
  const original_url = req.body.url
  
  if (!urlRegex.test(original_url)) res.json({ 'error': 'invalid url' })

  else {
    const url = new Url({ 'original_url': original_url })

    try {
      await url.save()
      console.log('Url saved into database')
    } catch {
      console.error('Url already are in database')
    }

    res.redirect(original_url)
  }
})

app.get('/api/shorturl/:id_short_url', async (req, res) => {
  try {
    const url = await Url.findById(req.params.id_short_url)
    const originalUrl = url.original_url
    res.redirect(originalUrl)
  } catch {
    res.json({ 'error': 'invalid url' })
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
