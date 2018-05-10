const config = require('./config')

exports.run = (client, message) => {
  client.funcs.db.incr(message.author.id, 'coins', config.coinsPerMessage)
}
