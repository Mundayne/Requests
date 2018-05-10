var rawjs = require('raw.js');
var reddit = new rawjs("Dank Meme Bot/1.0 by MundaneBackflip");
const CONFIG = require('./config.json');
const Discord = require('discord.js');
const bot = new Discord.Client();
//authenticate
reddit.setupOAuth2(CONFIG.bot.id, CONFIG.bot.secret, CONFIG.bot.uri);
/*
*
* Gets posts from the specified subreddit
*
*/
function getPosts(s, itms) {
  //redundant but just in case
  var subreddit = s || CONFIG.subreddit;
  var items = itms || CONFIG.items

  //get posts from reddit
  var posts = [];
  reddit.top({r: subreddit, limit: items, all: true, t: "all"}, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      response.children.forEach(item => {
        posts.push("https://www.reddit.com" + item.data.permalink);
      });

      //send posts
      posts.forEach(post => {
        bot.guilds.get(CONFIG.server).channels.get(CONFIG.channel).send(post);
      });
    }
  });
}

/*
*
* Checks the input subreddit and limit
*
*/
function check(params) {
  //only takes two parameters
  if (params.length > 2) return false;
  //if no parameters are specified, return defaults
  if (params.length == 0) return {subreddit: CONFIG.subreddit, items: CONFIG.items};

  //if a limit is specified, check it's a valid number
  if (params[1] && isNaN(params[1])) return false;
  //cap for limits is 100
  var it = params[1] > 100 ? 100 : params[1];

  //gets the subreddit name from input string
  var test = params[0].match(/([^/\s]+)/);
  var sub;
  test.forEach(res => {
    if (res != "r") {
      sub = res;
    }
  });

  //return the parsed info
  return {subreddit: sub, items: it};
}

/*
*
* Log messages to channel
*
*/
function log(msg) {
  bot.guilds.get(CONFIG.server).channels.get(CONFIG.channel).send(msg);
  console.log(msg);
}

/*
*
* Check all recieved messages
*
*/
bot.on('message', msg => {
  //bot can't reply to another bot
  if (msg.author.bot) return;

  //command must begin with prefix
  if (!msg.content.startsWith(CONFIG.prefix)) return;
  //command must be dm:top [param] [param]
  if (!msg.content.startsWith(CONFIG.prefix + "top")) return log("Invalid command.");

  //split off parameters
  var params = msg.content.split(' ').slice(1);

  //check params
  var result = check(params);
  //if the params don't parse, do nothing
  if (!result) return log("Parameters didn't parse.");
  //get posts and send them
  getPosts(result.subreddit, result.items);
});

//log readiness to the console
bot.on('ready', () => {
  console.log(`Ready to serve in ${bot.channels.size} channels on \
${bot.guilds.size} servers, for a total of ${bot.users.size} users.`);
});

//log in the bot
bot.login(CONFIG.token);
