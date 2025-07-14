require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json())
const {v4: uuidv4} = require('uuid')
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urlDatabase = {};

app.post("/shorten", (req, res)=>{
  const original_url = req.body
  if(!original_url){
    return res.status(400).json({error : "Original URL is required"});
  }
  if(!validator.isURL(original_url,{require_protocol : true})){
    return res.status(400).json({error : "Invalid URL format. Include 'http://' or 'https://'"})
  }
  try{
    new URL(original_url);
  }catch(err){
    return res.status(400).json({err:'URL invalide'});
  }

  const shortID = uuidv4().substring(0,6);

  urlDatabase[shortID] = original_url;

  res.json({
    original_url,
    shortURL: `http://localhost:3000/${shortID}`
  })
})

app.get("/:shortId", (req, res) =>{
  const shortId = req.params;
  const original_url = urlDatabase[shortId];
  if(original_url){
    res.redirect(original_url)
  }else{
    res.status(404).send('URL non trouvé')
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
