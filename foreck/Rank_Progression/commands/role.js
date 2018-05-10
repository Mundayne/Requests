const config = require('./config')
const roles = config.roles

exports.run = async (client, message, ...args) => {
  let player = client.funcs.db.get(message.author.id)

  if (!args[0]) return message.author.send('Please provide a role.')
  let pick = args[0]

  if (Object.keys(roles.choice).indexOf(pick) > -1) {
    if (Object.keys(roles.choice).indexOf(player.role) > -1) {
      return message.author.send(`You've already selected the ${player.role} class.`)
    } else if (player.coins >= roles.choice[pick].cost) {
      await client.funcs.db.incr(message.author.id, -roles.choice[pick].cost)
      await client.funcs.db.set(message.author.id, 'role', pick)
      await message.member.addRole(roles.choice[pick].id)
    } else {
      return message.author.send(`You don't have enough coins for that (${player.coins}/${config.choice[pick].cost}).`)
    }
  } else if (Object.keys(roles).indexOf(pick) > -1) {
    if (pick === 'choice') return message.author.send('That\'s not a valid choice.')

    if (player.coins >= roles[pick].cost) {
      await client.funcs.db.incr(message.author.id, -roles[pick].cost)
      await client.funcs.db.set(message.author.id, 'role', pick)
      await message.member.addRole(roles[pick].id)
    }
  }
}
