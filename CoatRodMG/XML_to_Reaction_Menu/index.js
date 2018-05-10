const discord = require('discord.js')
const fs = require('fs')
const parser = require('xml2json')
const RC = require('reaction-core')
const RM = require('reaction-menu')

const config = require('./config')

const client = new discord.Client()
const handler = new RC.Handler()

let files = []
config.fileLocations.forEach(file => {
  files.push(JSON.parse(parser.toJson(fs.readFileSync(file))))
})

client.on('messageReactionAdd', (messageReaction, user) => handler.handle(messageReaction, user))

let menu
client.on('message', async message => {
  if (message.content === ';;') {
    menu = new RM.Menu(message.channel, handler)
    let buttons = makeButtons(menu)
    for (let page of pages) await menu.add(page).catch(console.error)
    menu.send(buttons, { disable: { left: true, right: true } }).catch(console.error)
  } else if (message.content === ';!') {
    menu.select(2)
  }
})

client.login(config.token)

let pages = []
files.forEach(file => {
  pages.push({
    author: {
      name: file.Object.id,
      icon: file.Object.Image
    },
    thumbnail: {
      url: file.Object.Image
    },
    fields: [
      {
        name: 'Stats',
        value: `**HP:** ${file.Object.Health}
**EXP:** ${file.Object.Exp}`
      },
      {
        name: file.Object.Projectile.id,
        value: file.Object.Projectile.Emote,
        inline: false
      }
    ]
  }, {
    author: {
      name: file.Object.Projectile.id
    }
  })
})

let makeButtons = menu => {
  let buttons = [{
    emoji: config.mainEmoji,
    run: (user, message) => {
      menu.select(1).catch(console.error)
    }
  }]

  for (let i = 0; i < files.length; i++) {
    buttons.push({
      emoji: /<:.+:(\d+)/.exec(files[i].Object.Projectile.Emote)[1],
      run: (user, message) => {
        menu.select(2).catch(console.error)
      }
    })
  }

  return buttons
}
