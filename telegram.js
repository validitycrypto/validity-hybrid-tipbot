const telegramApi = require('telegraf/telegram');
const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const wallet = require('./wallet.js');
const telegraf = require('telegraf');

const transactionModal  = (_hash) => Markup.inlineKeyboard([
  Markup.urlButton('🔗 Tx',`https://explorer.egem.io/tx/${_hash}`),
  Markup.callbackButton('🔥 Tip', 'fire')
])

const menuModal = Markup.inlineKeyboard([
  [ Markup.callbackButton('🏆 Leaderboard', 'leaderboard')],
  [ Markup.callbackButton('⭐️ Generate', 'generate'),
    Markup.callbackButton('💰 Balance', 'balance') ],
  [ Markup.callbackButton('🌀 Deposit', 'deposit') ,
    Markup.callbackButton('⚒ Commands', 'commands') ],
  [ Markup.callbackButton('🙌 Help', 'help'),
    Markup.urlButton('🌐 Website', 'https://validity.ae') ]
])

const commandList =
   '⚒ ***Commands*** ⚒'
   +'\n\n***Withdraw:*** `/withdraw <address> <amount> <asset>`'
   +'\n***Tip:*** `/tip <amount> <user> <asset>`'
   +'\n***Rain***: `/rain <amount> <asset>`'
   +'\n***Leaderboard:*** `/leaderboard`'
   +'\n***Generate:*** `/generate`'
   +'\n***Deposit:*** `/deposit`'
   +'\n***Balance:*** `/balance`'
   +'\n***Menu:*** `/start`'
   +'\n***Help:*** `/help`';

module.exports.tbot = tbot = new telegraf(_tg)
const tapi = new telegramApi(_tg)

tbot.start((ctx) => ctx.replyWithMarkdown(
  '🌀 ***Welcome to the Validity (VDLY) Hybrid tipbot*** 🌀'
   + '\n\nCompatible across `Discord` and `Telegram` 💜💙'
   + '\n\nTo start, generate an account to start tipping!'
   + '\nFor more info check out @ValidityCrypto ✅'
   + '\nMost importantly, have fun.'
   + '\n\nCreated by @xGozzy'
,Extra.markup(menuModal)))

tbot.command('leaderboard', async(ctx) => {
  var token = await wallet.tokenTotal("telegram");
  var gas = await wallet.gasTotal("telegram");
  return ctx.replyWithMarkdown(
  '👾 ***EtherGem*** 👾'
  +'\n\n***1:*** ' + `@${gas[0]}` + ' ***-*** ' + '`' + `${gas[gas[0]]}` + '`' + '` EGEM`'
  +'\n***2:*** ' + `@${gas[1]}` + ' ***-*** ' + '`' + `${gas[gas[1]]}` + '`' + '` EGEM`'
  +'\n***3:*** ' + `@${gas[2]}` + ' ***-*** ' + '`' + `${gas[gas[2]]}` + '`' + '` EGEM`'
  +'\n***4:*** ' + `@${gas[3]}` + ' ***-*** ' + '`' + `${gas[gas[3]]}` + '`' + '` EGEM`'
  +'\n***5:*** ' + `@${gas[4]}` + ' ***-*** ' + '`' + `${gas[gas[4]]}` + '`' + '` EGEM`'

  +'\n\n🌀 ***Validity*** 🌀'
  +'\n\n***1:*** ' + `@${token[0]}` + ' ***-*** ' + '`' + `${token[token[0]]}` + '`' + '` VLDY`'
  +'\n***2:*** ' + `@${token[1]}` + ' ***-*** ' + '`' + `${token[token[1]]}` + '`' + '` VLDY`'
  +'\n***3:*** ' + `@${token[2]}` + ' ***-*** ' + '`' + `${token[token[2]]}` + '`' + '` VLDY`'
  +'\n***4:*** ' + `@${token[3]}` + ' ***-*** ' + '`' + `${token[token[3]]}` + '`' + '` VLDY`'
  +'\n***5:*** ' + `@${token[4]}` + ' ***-*** ' + '`' + `${token[token[4]]}` + '`' + '` VLDY`');

})

tbot.action('leaderboard', async(ctx) => {
  var token = await wallet.tokenTotal("telegram");
  var gas = await wallet.gasTotal("telegram");
  return ctx.replyWithMarkdown(
  '💎 ***EtherGem*** 💎'
  +'\n\n***1:*** ' + `@${gas[0]}` + ' ***-*** ' + '`' + `${gas[gas[0]]}` + '`' + '` EGEM`'
  +'\n***2:*** ' + `@${gas[1]}` + ' ***-*** ' + '`' + `${gas[gas[1]]}` + '`' + '` EGEM`'
  +'\n***3:*** ' + `@${gas[2]}` + ' ***-*** ' + '`' + `${gas[gas[2]]}` + '`' + '` EGEM`'
  +'\n***4:*** ' + `@${gas[3]}` + ' ***-*** ' + '`' + `${gas[gas[3]]}` + '`' + '` EGEM`'
  +'\n***5:*** ' + `@${gas[4]}` + ' ***-*** ' + '`' + `${gas[gas[4]]}` + '`' + '` EGEM`'

  +'\n\n🌀 ***Validity*** 🌀'
  +'\n\n***1:*** ' + `@${token[0]}` + ' ***-*** ' + '`' + `${token[token[0]]}` + '`' + '` VLDY`'
  +'\n***2:*** ' + `@${token[1]}` + ' ***-*** ' + '`' + `${token[token[1]]}` + '`' + '` VLDY`'
  +'\n***3:*** ' + `@${token[2]}` + ' ***-*** ' + '`' + `${token[token[2]]}` + '`' + '` VLDY`'
  +'\n***4:*** ' + `@${token[3]}` + ' ***-*** ' + '`' + `${token[token[3]]}` + '`' + '` VLDY`'
  +'\n***5:*** ' + `@${token[4]}` + ' ***-*** ' + '`' + `${token[token[4]]}` + '`' + '` VLDY`');

})

tbot.command('balance', async(ctx) => {
  var account = await wallet.viewAccount(ctx.message.from.username);
  if(account == undefined){
    return ctx.replyWithMarkdown('⚠️ ***Please generate an account first by using the command:*** `/generate`');
  } else {
    var token = await wallet.tokenbalance(account);
    var gas = await wallet.gasBalance(account);
    return ctx.replyWithMarkdown(`@${ctx.message.from.username}'s funds: ` + '`' + ` 💎 ${gas}`
    + ' EGEM ' + ` 🌀 ${token}`  + ' VLDY' + '`');
  }
})

tbot.action('balance' , async(ctx) => {
  var response;
  var account = await wallet.viewAccount(ctx.callbackQuery.from.username);
  if(account == undefined){
    return ctx.replyWithMarkdown('⚠️ ***Please generate an account first by using the command:*** `/generate`');
  } else {
    var token = await wallet.tokenbalance(account);
    var gas = await wallet.gasBalance(account);
    return ctx.replyWithMarkdown(`@${ctx.callbackQuery.from.username}'s funds: ` + '`' + ` 💎 ${gas}`
    + ' EGEM ' + ` 🌀 ${token}` + ' VLDY' + '`');
  }
})

tbot.command('deposit', async(ctx) => {
  var nuo = await wallet.viewAccount(ctx.message.from.username);
  return ctx.replyWithMarkdown(`@${ctx.message.from.username} your depositing address is: ` + '`' + `${nuo}` + '`');
})

tbot.action('deposit', async(ctx) => {
  var nuo = await wallet.viewAccount(ctx.callbackQuery.from.username);
  return ctx.replyWithMarkdown(`@${ctx.callbackQuery.from.username} your depositing address is: ` + '`' + `${nuo}` + '`');
})

tbot.command('generate', async(ctx) => {
  var address = await wallet.createAccount(ctx.message.from.username, ctx.message.from.id);
  if(address == undefined){
    return ctx.replyWithMarkdown(`🚫 @${ctx.message.from.username} ***you have already generated an account***`);
  } else if(address != undefined) {
    return ctx.replyWithMarkdown(`@${ctx.message.from.username} your account address is: ` + '`' + `${address}` + '`');
  }
})

tbot.action('generate', async(ctx) => {
  var address = await wallet.createAccount(ctx.callbackQuery.from.username, ctx.callbackQuery.id);
  if(address == undefined){
    return ctx.replyWithMarkdown(`🚫 @${ctx.callbackQuery.from.username} ***you have already generated an account***`);
  } else if(address != undefined) {
    return ctx.replyWithMarkdown(`@${ctx.callbackQuery.from.username} your account address is: ` + '`' + `${address}` + '`');
  }
})

tbot.command('/commands', async(ctx) => {
  return ctx.replyWithMarkdown(commandList)
})

tbot.action('commands', async(ctx) => {
  return ctx.replyWithMarkdown(commandList)
})

tbot.command('/tip', async(ctx) => {
  var caller = ctx.message.from.username;
  var parameters = ctx.message.text.split("/tip ").pop().split(" ");
  var reciever = await wallet.viewAccount(parameters[0].replace('@', ''));
  var payee = await wallet.getAccount(caller);

  if(payee == undefined){
    return ctx.replyWithMarkdown('⚠️ ***Please generate an account first by using the command:*** `/generate`');
  } else if(reciever == undefined){
    return ctx.replyWithMarkdown('⚠️ ***Recipent has not generated an account***');
  } else if(reciever == payee){
    return ctx.replyWithMarkdown('🙃 ***Hey bucko, you cannot tip yourself***');
  } else {
    var token = await wallet.tokenbalance(payee);
    var gas = await wallet.gasBalance(payee);
    if(parameters[1] % 1 != 0 && parseFloat(parameters[1]) > 999){ parameters[1] = parameters[1] - parameters[1] % 1; }
    if(gas != 0 && token != 0 && parseFloat(parameters[1]) <= token && parameters[2] == "VLDY"
       || gas != 0 && parseFloat(parameters[1]) <= gas && parameters[2] == "EGEM"){
      var tx = await wallet.tipUser("telegram", caller, payee, reciever, parameters[1], parameters[2]);
      return ctx.replyWithMarkdown(`@${caller} tipped ${parameters[0]} of ` + ' `' + `${parameters[1]} ${parameters[2]}` + ' `' +  '🎉',
        Extra.markup(transactionModal(tx)))
    } else if(token < parseFloat(parameters[1]) && parameters[2] == "VLDY"){
      return ctx.replyWithMarkdown('🚫  ***Insufficent token balance available for transaction***');
    } else if(gas < parseFloat(parameters[1]) && parameters[2] == "EGEM"){
      return ctx.replyWithMarkdown('🚫  ***Insufficent gas balance available for transaction***');
    } else if(token == 0 && gas != 0){
      return ctx.replyWithMarkdown('🚫  ***No tokens available for transaction***');
    } else if(gas == 0){
      return ctx.replyWithMarkdown('🚫  ***No gas available for transaction***');
    } else {
      return ctx.replyWithMarkdown('🚫  ***Incorrect command format***');
    }
  }
})

tbot.action('fire', async(ctx) => {
  var caller = ctx.callbackQuery.from.username;
  var parameters = JSON.stringify(ctx.callbackQuery.message.text).split(" ");
  var reciever = await wallet.viewAccount(parameters[2].replace('@', ''));
  var payee = await wallet.getAccount(caller);

  if(payee == undefined){
    return ctx.answerCbQuery("⚠️  Please generate an account firstly by using the command: /generate");
  } else if(reciever == payee){
    return ctx.answerCbQuery('⚠️ Hey dude, you cannot tip yourself');
  } else {
    var token = await wallet.tokenbalance(payee);
    var gas = await wallet.gasBalance(payee);
    if(gas != 0 && token != 0 && parseFloat(parameters[5]) <= token && parameters[6] == "VLDY"
       || gas != 0 && parseFloat(parameters[5]) <= gas && parameters[6] == "EGEM"){
      var tx = await wallet.tipUser("telegram", caller, payee, reciever, parameters[5],parameters[6]);
      return ctx.replyWithMarkdown(`@${caller} tipped ${parameters[2]} of ` + ' `' + `${parameters[5]} ${parameters[6]}` + ' `' +  '🔥',
        Extra.markup(transactionModal(tx)))
    } else if(token < parseFloat(parameters[5]) && parameters[6] == "VLDY"){
      return ctx.answerCbQuery("🚫  Insufficent token balance available for transaction");
    } else if(gas < parseFloat(parameters[5]) && parameters[6] == "EGEM"){
      return ctx.answerCbQuery("🚫  Insufficent gas balance available for transaction");
    } else if(token == 0 && gas != 0){
      return ctx.answerCbQuery("🚫  No tokens available for transaction");
    } else if(gas == 0){
      return ctx.answerCbQuery("🚫  No gas available for transaction");
    }
  }
})

tbot.command('/rain', async(ctx) => {
  var caller = ctx.message.from.username;
  var parameters = ctx.message.text.split("/rain ").pop().split(" ");
  var payee = await wallet.getAccount(caller);

  if(payee == undefined){
    return ctx.replyWithMarkdown('⚠️ ***Please generate an account first by using the command:*** `/generate`');
  } else {
    var token = await wallet.tokenbalance(payee);
    var gas = await wallet.gasBalance(payee);
    if(parameters[1] % 1 != 0 && parseFloat(parameters[0]) > 999){ parameters[0] = parameters[0] - parameters[0] % 1; }
    if(gas != 0 && token != 0 && parseFloat(parameters[0]*5) <= token && parameters[1] == "VLDY"
       || gas != 0 && parseFloat(parameters[0]*5) <= gas && parameters[1] == "EGEM"){
         var users = await wallet.tipRain("telegram", caller, payee, parameters[0], parameters[1]);
         if(users.length > 0){
           return ctx.replyWithMarkdown(`@${caller} rained ${users} of ` + ' `' + `${parameters[0]} ${parameters[1]}` + ' `' +  '💥');
         } else if(users.length == 0){
           return ctx.replyWithMarkdown('⚠️ ***No users active to rain***');
         }
    } else if(token < parseFloat(parameters[0]*5) && parameters[1] == "VLDY"){
      return ctx.replyWithMarkdown('🚫  ***Insufficent token balance available for transaction***');
    } else if(gas < parseFloat(parameters[0]*5) && parameters[1] == "EGEM"){
      return ctx.replyWithMarkdown('🚫  ***Insufficent gas balance available for transaction***');
    } else if(token == 0 && gas != 0){
      return ctx.replyWithMarkdown('🚫  ***No tokens available for transaction***');
    } else if(gas == 0){
      return ctx.replyWithMarkdown('🚫  ***No gas available for transaction***');
    } else {
      return ctx.replyWithMarkdown('🚫  ***Incorrect command format***');
    }
  }
})
