const location = "0x9b729a8f44e0cc028754aa84787f00dd96077710";
const json  = require("./build/contracts/ERC20d.json");
const telegramApi = require('telegraf/telegram');
const discordjs = require('discord.js');
const telegraf = require('telegraf');
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const firebase = require('firebase');
const Web3 = require('web3');

const _web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:9545');
const _instance = new _web3.eth.Contract(json.abi, location);


const _ether = Math.pow(10,18);

const keyboard = (_hash) => Markup.inlineKeyboard([
  Markup.urlButton('🔗 Transaction',`https://explorer.egem.io/tx/${_hash}`),
  Markup.callbackButton('🔥 Tip', 'fire')
])

initialiseDatabase = async() => {
   firebase.initializeApp(_preferences);
   firebase.firestore().settings({
     timestampsInSnapshots: true
   });
 }

getAccount = async(_username) => {
   var id = await getID(_username);
   if(id != undefined){
     return await firebase.firestore().collection(id)
     .orderBy('privateKey', 'desc').limit(1).get()
     .then(async(state) => {
       var result;
       await state.forEach((asset) => {
          result = asset.data().privateKey;
        })
      result = _web3.eth.accounts.privateKeyToAccount(result);
      return result.address;
    })
  } else {
    return id;
  }
}

getID = async(_username) => {
   return await firebase.firestore().collection(_username)
   .orderBy('id', 'desc').limit(1).get()
   .then(async(state) => {
     var result;
      await state.forEach((asset) => {
         result = asset.data().id;
      })
    return result;
 })
}

tipUser = async(_payee, _reciever, _amount, _asset) => {
    if(_asset == "VLDY"){
      return await tokenTransfer(_payee, _reciever, _amount);
    } else if(_asset == "EGEM"){
      return await gasTransfer(_payee, _reciever, _amount);
  }
}

createAccount = async(_username, _chatid) => {
  _chatid = "v" + _chatid;
  if(await getAccount(_username) == undefined){
    var account = _web3.eth.accounts.create();
    await firebase.firestore().collection(_chatid).add({
      privateKey: account.privateKey });
    await firebase.firestore().collection(_username).add({
      id: _chatid });
    return `🎉  Congratzi your new account is ${account.address}`;
  }
  else {
    return "🚫  You already have an account"
  }
}

tokenbalance = async(_target) => {
  const balance = await _instance.methods.balanceOf(_target).call();
  return parseFloat(balance/_ether).toFixed(4);
}

gasBalance = async(_target) => {
  var balance = await _web3.eth.getBalance(_target)
  return parseFloat(balance/_ether).toFixed(4);
}

gasTransfer = async(_payee, _recipent, _amount) => {
  _amount = _web3.utils.toBN(_amount).mul(_web3.utils.toBN(1e18));
  const tx = await _web3.eth.sendTransaction({
    value: _amount,
    from: _payee,
    to: _recipent,
    gas: 2750000
  })
  return tx.transactionHash;
}

tokenTransfer = async(_payee, _recipent, _amount) => {
  _amount = _web3.utils.toHex(_web3.utils.toBN(_amount).mul(_web3.utils.toBN(1e18)));
  const tx = await _instance.methods.transfer(_recipent, _amount)
  .send({ from: _payee, gas: 2750000 });
  return tx.transactionHash;
}

retractFee = async(_payee, _recipent, _amount) => {
  return await _web3.eth.sendTransaction({
    amount: _ether,
    from: _payee,
    to: _reciever,
    gas: 2750000
  }).send();
}

initialiseDatabase();

const tbot = new telegraf(_tg)
const tapi = new telegramApi(_tg)

tbot.start((ctx) => ctx.reply(
  'Welcome to the Validity (VDLY) Hybrid tipbot 🎉'
   + '\n\nCompatible across Discord and Telegram 💜💙'
   + '\nTo start, register an account by using the command: /generate'
   + '\n\nNow, you can recieve and send tips in EGEM and VLDY from and to other users !'
   + '\nCheck out all the bot has to offer by using the commands: /help and /commands'
   + '\nFor more info check out @ValidityCrypto ✅'
   + '\nMost importantly, have fun.'
   + '\n\nCreated by @xGozzy'
))

tbot.command('balance', async(ctx) => {
  var response;
  var account = await getAccount(ctx.message.from.username);
  if(account == undefined){
    response = "⚠️  Please generate an account first by using the command: /generate";
  } else {
    var token = await tokenbalance(account);
    var gas = await gasBalance(account);
    response = `💎  EGEM: ${gas} ✅ VLDY: ${token}`;
  }
  return ctx.reply(response);
})

tbot.command('deposit', async(ctx) => {
  var nuo = await getAccount(ctx.message.from.username);
  return ctx.reply(`@${ctx.message.from.username} your depositing address is: ${nuo}`);
})

tbot.command('generate', async(ctx) => {
  var user = ctx.message.from.username;
  var id =  ctx.message.chat.id;
  var nuo = await createAccount(user, id);
  return ctx.reply(`${nuo}`);
})

tbot.command('/tip', async(ctx) => {
  var caller = ctx.message.from.username;
  var parameters = ctx.message.text.split("/tip ").pop().split(" ");
  var reciever = await getAccount(parameters[0].replace('@', ''));
  var payee = await getAccount(caller);

  if(payee == undefined){
    return ctx.reply("⚠️  Please generate an account firstly by using the command: /generate");
  } else if(reciever == undefined){
    return ctx.reply("⚠️  Recipent has not generated an account");
  } else {
    var token = await tokenbalance(payee);
    var gas = await gasBalance(payee);
    if(gas != 0 && token != 0 && parseFloat(parameters[1]) <= token && parameters[2] == "VLDY"
       || gas != 0 && parseFloat(parameters[1]) <= gas && parameters[2] == "EGEM"){
      var tx = await tipUser(payee, reciever, parameters[1], parameters[2]);
      return ctx.reply(`@${caller} tipped ${parameters[0]} of ${parameters[1]} ${parameters[2]} 🎉`,
        Extra.markup(keyboard(tx)))
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
  var reciever = await getAccount(parameters[2].replace('@', ''));
  var payee = await getAccount(caller);

  if(payee == undefined){
    return ctx.answerCbQuery("⚠️  Please generate an account firstly by using the command: /generate");
  } else {
    var token = await tokenbalance(payee);
    var gas = await gasBalance(payee);
    if(gas != 0 && token != 0 && parseFloat(parameters[4]) <= token && parameters[5] == "VLDY"
       || gas != 0 && parseFloat(parameters[4]) <= gas && parameters[5] == "EGEM"){
      var tx = await tipUser(payee, reciever, parameters[4],parameters[5]);
      return ctx.reply(`@${caller} tipped ${parameters[2]} of ${parameters[4]} ${parameters[5]} 🔥`,
        Extra.markup(keyboard(tx)))
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

tbot.launch()
