const elasticsearch = require('elasticsearch')
const cities = require('./cities.json')

const client = new elasticsearch.Client({
    hosts: ['http://localhost:9200']
})

client.ping({
    requestTimeout: 30000
},
error => {
    if (error) {
      console.log('Server is down')
    } else {
      console.log('200 server is fine')
    }
})


var bulk = []

cities.forEach(city => {
  bulk.push({
    index: {
      _index: 'elasticsearch',
      _type: 'cities_list'
    }
  })
  bulk.push(city)
})

client.bulk({ body: bulk }, function (err, response) {
  if (err) {
    console.log("Failed Bulk operation", err)
  } else {
    console.log("Successfully imported", cities.length);
  }
});