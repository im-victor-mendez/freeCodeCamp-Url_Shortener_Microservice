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
  const original_url = req.body.url
  
  const url = new Url({ 'original_url': original_url })
  await url.save()

  res.redirect(original_url)
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
