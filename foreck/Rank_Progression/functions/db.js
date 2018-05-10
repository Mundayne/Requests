const level = require('level')
let players = level('./data/players')
const config = require('./config')

exports.get = id => {
  players.get(id, (err, val) => {
    if (err) {
      if (err.notFound) {
        console.info(`New player; instancing...`)
        exports.new(id)
      } else {
        return val
      }
    }
  })
}

exports.new = id => {
  players.put(id, { coins: config.coinsPerMessage, role: config.roles.default })
  return exports.get(id)
}

exports.incr = (id, key, increment) => {
  let player = exports.get(id)
  player[key] += increment
  players.put(id, player)
}

exports.set = (id, key, value) => {
  let player = exports.get(id)
  player[key] = value
  players.put(id, player)
}
