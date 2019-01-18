const { getAccount, getID, tipUser, createAccount, gasBalance, tokenbalance }  = require('./wallet.js');

const telegramApi = require('telegraf/telegram');
const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const wallet = require('./wallet.js');
const telegraf = require('telegraf');

const transactionModal  = (_hash) => Markup.inlineKeyboard([
  Markup.urlButton('🔗 Transaction',`https://explorer.egem.io/tx/${_hash}`),
  Markup.callbackButton('🔥 Tip', 'fire')
])

const menuModal = Markup.inlineKeyboard([
  [ Markup.callbackButton('⭐️ Generate', 'generate'),
    Markup.callbackButton('💰 Balance', 'balance') ],
  [ Markup.callbackButton('☘️ Deposit', 'deposit') ,
    Markup.callbackButton('🔑 Command', 'commands') ],
  [ Markup.callbackButton('✅ Help', 'help'),
    Markup.urlButton('🌐 Website', 'https://validity.ae') ]
])

module.exports.tbot = tbot = new telegraf(_tg)
const tapi = new telegramApi(_tg)

tbot.start((ctx) => ctx.reply(
  'Welcome to the Validity (VDLY) Hybrid tipbot 🎉'
   + '\n\nCompatible across Discord and Telegram 💜💙'
   + '\nTo start, generate an account to start tipping!'
   + '\nFor more info check out @ValidityCrypto ✅'
   + '\nMost importantly, have fun.'
   + '\n\nCreated by @xGozzy'
,Extra.markup(menuModal)))

tbot.command('balance', async(ctx) => {
  var account = await wallet.getAccount(ctx.message.from.username);
  if(account == undefined){
    return ctx.reply("⚠️  Please generate an account first by using the command: /generate");
  } else {
    var token = await wallet.tokenbalance(account);
    var gas = await wallet.gasBalance(account);
    return ctx.reply(`💎  EGEM: ${gas} ✅ VLDY: ${token}`);
  }
})

tbot.action('balance', async(ctx) => {
  var response;
  var account = await wallet.getAccount(ctx.callbackQuery.from.username);
  if(account == undefined){
    response = "⚠️  Please generate an account first by using the command: /generate";
  } else {
    var token = await wallet.tokenbalance(account);
    var gas = await wallet.gasBalance(account);
    response = `💎  EGEM: ${gas} ✅ VLDY: ${token}`;
  }
  return ctx.reply(response);
})

tbot.command('deposit', async(ctx) => {
  var nuo = await wallet.getAccount(ctx.message.from.username);
  return ctx.reply(`@${ctx.message.from.username} your depositing address is: ${nuo}`);
})

tbot.action('deposit', async(ctx) => {
  var nuo = await wallet.getAccount(ctx.callbackQuery.from.username);
  return ctx.reply(`@${ctx.callbackQuery.from.username} your depositing address is: ${nuo}`);
})

tbot.command('generate', async(ctx) => {
  var nuo = await wallet.createAccount(ctx.message.from.username, ctx.message.chat.id);
  return ctx.reply(`${nuo}`);
})

tbot.action('generate', async(ctx) => {
  var nuo = await wallet.createAccount(ctx.callbackQuery.from.username, ctx.callbackQuery.id);
  return ctx.reply(`${nuo}`);
})

tbot.command('/commands', async(ctx) => {
  return ctx.reply(
   `\nWithdraw: /withdraw <address> <amount> <asset>
    \nTip: /tip <amount> <user> <asset>
    \nRain: /rain <amount> <asset>
    \nLeaderboard: /leaderboard
    \nGenerate: /generate
    \nDeposit: /deposit
    \nBalance: /balance
    \nMenu UI: /start
    \nHelp: /help`
  )
})

tbot.action('commands', async(ctx) => {
  return ctx.reply(
   `\nWithdraw: /withdraw <address> <amount> <asset>
    \nTip: /tip <amount> <user> <asset>
    \nRain: /rain <amount> <asset>
    \nLeaderboard: /leaderboard
    \nGenerate: /generate
    \nDeposit: /deposit
    \nBalance: /balance
    \nMenu UI: /start
    \nHelp: /help`
  )
})

tbot.command('/yip', async(ctx) => {
  var caller = ctx.message.from.username;
  var parameters = ctx.message.text.split("/yip ").pop().split(" ");
  var reciever = await wallet.getAccount(parameters[0].replace('@', ''));
  var payee = await wallet.getAccount(caller);

  if(payee == undefined){
    return ctx.reply("⚠️  Please generate an account firstly by using the command: /generate");
  } else if(reciever == undefined){
    return ctx.reply("⚠️  Recipent has not generated an account");
  } else {
    var token = await wallet.tokenbalance(payee);
    var gas = await wallet.gasBalance(payee);
    if(gas != 0 && token != 0 && parseFloat(parameters[1]) <= token && parameters[2] == "VLDY"
       || gas != 0 && parseFloat(parameters[1]) <= gas && parameters[2] == "EGEM"){
      var tx = await wallet.tipUser("telegram", caller, payee, reciever, parameters[1], parameters[2]);
      return ctx.reply(`@${caller} tipped ${parameters[0]} of ${parameters[1]} ${parameters[2]} 🎉`,
        Extra.markup(transactionModal(tx)))
    } else if(token < parseFloat(parameters[1]) && parameters[2] == "VLDY"){
      return ctx.reply("🚫  Insufficent token balance available for transaction");
    } else if(gas < parseFloat(parameters[1]) && parameters[2] == "EGEM"){
      return ctx.reply("🚫  Insufficent gas balance available for transaction");
    } else if(token == 0 && gas != 0){
      return ctx.reply("🚫  No tokens available for transaction");
    } else if(gas == 0){
      return ctx.reply("🚫  No gas available for transaction");
    } else {
      return ctx.reply("🚫  Incorrect command format");
    }
  }
})

tbot.action('fire', async(ctx) => {
  var caller = ctx.callbackQuery.from.username;
  var parameters = JSON.stringify(ctx.callbackQuery.message.text).split(" ");
  var reciever = await wallet.getAccount(parameters[2].replace('@', ''));
  var payee = await wallet.getAccount(caller);

  if(payee == undefined){
    return ctx.answerCbQuery("⚠️  Please generate an account firstly by using the command: /generate");
  } else {
    var token = await wallet.tokenbalance(payee);
    var gas = await wallet.gasBalance(payee);
    if(gas != 0 && token != 0 && parseFloat(parameters[4]) <= token && parameters[5] == "VLDY"
       || gas != 0 && parseFloat(parameters[4]) <= gas && parameters[5] == "EGEM"){
      var tx = await wallet.tipUser("telegram", caller, payee, reciever, parameters[4],parameters[5]);
      return ctx.reply(`@${caller} tipped ${parameters[2]} of ${parameters[4]} ${parameters[5]} 🔥`,
        Extra.markup(transactionModal(tx)))
    } else if(token < parseFloat(parameters[4]) && parameters[5] == "VLDY"){
      return ctx.answerCbQuery("🚫  Insufficent token balance available for transaction");
    } else if(gas < parseFloat(parameters[4]) && parameters[5] == "EGEM"){
      return ctx.answerCbQuery("🚫  Insufficent gas balance available for transaction");
    } else if(token == 0 && gas != 0){
      return ctx.answerCbQuery("🚫  No tokens available for transaction");
    } else if(gas == 0){
      return ctx.answerCbQuery("🚫  No gas available for transaction");
    }
  }
})
