const komada = require('komada')
const config = require('./config')

const client = new komada.Client({
  prefix: '/',
  cmdLogging: true
})

client.login(config.token)
