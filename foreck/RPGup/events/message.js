const level = require('level')
let players = level('./data/players')
let config = require('./config')

exports.run = (message) => {
  players.get(message.author.id, (err, val) => {
    if (err) {
      if (err.notFound) {
        console.info(`New player; instancing...`)
        players.put(message.author.id, { coins: config.coinsPerMessage, role: config.roles.default })
      }
    } else {
      players.put(message.author.id, { coins: val.coins += config.coinsPerMessage, role: val.role }, err => {
        if (err) console.error(err)
      })
    }
  })
}
