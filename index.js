const elasticsearch = require('elasticsearch')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const client = new elasticsearch.Client({
    hosts: ['http://localhost:9200']
})

const app = express()

client.ping({
    requestTimeout: 30000
  }, err => {
    if (err) {
    console.log('error occurred', err)
  } else {
    console.log('Success at 200!')
    }
})

app.use(bodyParser.json())
app.set('port', process.env.PORT || 3001)
// set path to serve static files
app.use(express.static(path.join(__dirname, 'public')));
// enable CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req,res) => {
  res.sendFile('template.html', {
    root: path.join(__dirname, 'views')
  })
})

app.get('/search', (req,res) => {
  let body = {
    size: 200,
    from: 0,
    query: {
      match: {
        name: req.query['q']
      }
    }
  }
  client.search({
    index: 'elasticsearch',
    body: body,
    type: 'cities_list'
  })
  .then(results => {
    res.send(results.hits.hits)
  })
  .catch(err => {
    console.log(err)
    res.send([])
  })
})

app.listen(app.get('port'), () => {
  console.log('listening on port'+app.get('port'))
})