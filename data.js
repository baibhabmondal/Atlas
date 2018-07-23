const elasticsearch = require('elasticsearch')

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