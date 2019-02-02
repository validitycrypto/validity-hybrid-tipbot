const Discord = require('discord.js');
const client = new Discord.Client();
const wallet = require('./wallet.js');

client.on('ready', async() => {
  await wallet.initialiseDatabase();
  console.log(`Logged in as ${client.user.tag}!`);
});


commandGenerate = async(_msg) => {
  var address = await wallet.createAccount(_msg.author.username, _msg.author.id);
  if(address == undefined){
    _msg.reply(` you have already generated an account 🚫`);
  } else if(address != undefined) {
    _msg.reply(` your account address is: ` + '`' + `${address}` + '`');
  }
}

commandBalance = async(_msg) => {
  var account = await wallet.viewAccount(_msg.author.username);
  if(account == undefined){
    return _msg.reply(' please generate an account first by using the command: `/generate` ⚠️');
  } else {
    var token = await wallet.tokenbalance(account);
    var gas = await wallet.gasBalance(account);
    return _msg.reply(' your funds are: ' + '<:ethergem:490221755756183554>' + '`' + ` ${gas}`
    + ` EGEM ` + '`' + ' <:validity:490221401232506882> ' + '`' + ` ${token}` + ` VLDY` + '`');
  }
}


commandLeaderboard = async(_msg) => {
  var token = await wallet.tokenTotal("discord");
  var gas = await wallet.gasTotal("discord");
  return _msg.reply(
  '\n<:ethergem:490221755756183554> **EtherGem** <:ethergem:490221755756183554>'
  +'\n\n***1:*** ' + `@${gas[0]}` + ' ***-*** ' + '`' + `${gas[gas[0]]}` + ' EGEM`'
  +'\n***2:*** ' + `@${gas[1]}` + ' ***-*** ' + '`' + `${gas[gas[1]]}` + ' EGEM`'
  +'\n***3:*** ' + `@${gas[2]}` + ' ***-*** ' + '`' + `${gas[gas[2]]}` + ' EGEM`'
  +'\n***4:*** ' + `@${gas[3]}` + ' ***-*** ' + '`' + `${gas[gas[3]]}` + ' EGEM`'
  +'\n***5:*** ' + `@${gas[4]}` + ' ***-*** ' + '`' + `${gas[gas[4]]}` + ' EGEM`'

  +'\n\n<:validity:490221401232506882> **Validity** <:validity:490221401232506882>'
  +'\n\n***1:*** ' + `@${token[0]}` + ' ***-*** ' + '`' + `${token[token[0]]}` + ' VLDY`'
  +'\n***2:*** ' + `@${token[1]}` + ' ***-*** ' + '`' + `${token[token[1]]}` + ' VLDY`'
  +'\n***3:*** ' + `@${token[2]}` + ' ***-*** ' + '`' + `${token[token[2]]}` + ' VLDY`'
  +'\n***4:*** ' + `@${token[3]}` + ' ***-*** ' + '`' + `${token[token[3]]}` + ' VLDY`'
  +'\n***5:*** ' + `@${token[4]}` + ' ***-*** ' + '`' + `${token[token[4]]}` + ' VLDY`');
}


client.on('message', async(msg) => {
  if(msg.content === '/generate') {
    return commandGenerate(msg);
  } else if(msg.content === '/balance') {
    return commandBalance(msg);
  } else if(msg.content === '/leaderboard') {
    return commandLeaderboard(msg);
  }
});


client.login('');
