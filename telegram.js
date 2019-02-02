const telegramApi = require('telegraf/telegram');
const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const wallet = require('./wallet.js');
const telegraf = require('telegraf');

const transactionModal  = (_hash) => Markup.inlineKeyboard([
  Markup.urlButton('🔗 Tx',`https://explorer.egem.io/tx/${_hash}`),
  Markup.callbackButton('🔥 Tip', 'fire')
])

const withdrawModal  = (_hash) => Markup.inlineKeyboard([
  Markup.urlButton('🔗 Tx',`https://explorer.egem.io/tx/${_hash}`),
  Markup.callbackButton('🙌 Praise', 'praise')
])

const menuModal = Markup.inlineKeyboard([
  [ Markup.callbackButton('🏆 Leaderboard', 'leaderboard')],
  [ Markup.callbackButton('🍀 Generate', 'generate'),
    Markup.callbackButton('💰 Balance', 'balance') ],
  [ Markup.callbackButton('⚡️ Deposit', 'deposit') ,
    Markup.callbackButton('⚒ Commands', 'commands') ],
  [ Markup.callbackButton('⭐️ Help', 'help'),
    Markup.urlButton('🌐 Website', 'https://validity.ae') ]
])

var randomAdmin = [
  'I have a marketing proposal for your ICO admin 🗣',
  'Blah, blah, blah, blah, BLAH!',
  'This is my turf dude 👊',
  `STOP YO SHILLIN' 😡`,
  'Get me some sugar',
  'We are good hun',
  `Y'all crazy ⏰`,
  'REEEEEEEEEEEE',
  'rofl',
  'kek'
];

var randomPraise = [
  'License and registration please 🔦 ',
  'But where is my tip?',
  'YEEEEEEAAAAHHHHH',
  'Seven blessings!',
  'Wen deposit? 👀',
  'Hallelujah! 👏',
  'For Nakamoto?',
  'YEEEEEEEET',
  'HODL',
  'pl0x'
];

var randomFacts = [
  'PoS (Proof of Stake) can be highly centralised, with the ability of a master public key which "solves" the nothing at stake condumrum, but at the cost of centralisation',
  `In the year 2017, 81% of all ICO's were amoral or inaffective, which resulted up to €300,0000,000 lost`,
  'A high TPS (Transactions per second) throughput, unfortunately means centralisation is immient',
  'ICOBench has a pay-per-review tiered system, with the more you bid the better the rating you get',
  `There is over 32 BTC to be won, if one can solve Satoshi's puzzle transactions`,
  'BFT (Byzantine Fault Tolerance) is very susipectible to manipulation',
  'Approximately 61% of the EOS supply resides in 100 addresses',
  'Majority fo TRX dApps only orientate towards on gambling use-cases',
  'Over 80% of the tops pairs on CMC are washedtraded'
];

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

const helpInfo =
    '⭐️ ***Help*** ⭐️'
    +'\n\n`Command parameters`'
    +'\n`<user>` - An active telegram username, eg: @xGozzy'
    +'\n`<amount>` - The amount one wishes to tip, eg: `100`'
    +'\n`<asset>` - The asset one wishes to tip, eg: `EGEM` or `VLDY`'
    +'\n`<address>` - The address one wishes to withdraw to, eg:`0xA5d505F9EfA7aFC13C82C1e87E12F0562A5ed78f`'
    +'\n\n`Command format`'
    +'\nIn order to execute transactional based operations corrrectly, one must follow the format of the specified command.'
    +' If we look at our tip function we can see that it requires 3 parameters, an amount, a user and the chosen asset:'
    +'\n`/tip <user> <amount> <asset>`'
    +'\nIf we were to actually fill in the parameters it would look like so:'
    +'\n`/tip @xGozzy 1 EGEM`'
    +'\n\nIf one was to use the rain command which format is declared as:'
    +'\n`/rain <amount> <asset>`'
    +'\nIt would be called as so:'
    +'\n`/rain 100 VLDY`'
    +'\n\nThen finally the withdraw command:'
    +'\n`/withdraw <address> <amount> <asset>`'
    +'\nWould look like:'
    +'\n`/withdraw 0xA5d505F9EfA7aFC13C82C1e87E12F0562A5ed78f 1 EGEM`'
    +'\n\n`Fees and gas dependency`'
    +'\nIn order to send transactions, one must have a EGEM balance to pay compensation for the transaction fee.'
    +' This means one cannot tip VLDY without an active EGEM balance.'
    +'\n\nAs this bot is not funded, there will be a fee implementation of ***1 EGEM per tip*** in order to allow it be'
    +' hosted on a virtual machine for 24/7 uptime and swift responses. A % of the fees will be split among the core team'
    +' and a % will be isolated for community events.'
    +'\n\n`Security disclaimer`'
    +'\nThis bot is ***centralised*** and is not ultimately secure for storing large amount of assets, please use an associated'
    +' EtherGem wallet to store your funds securely: \nhttps://myegemwallet.com/'
    +'\n\n`Users must take it into their own responsibilities to withdraw their'
    +' own balances frequently. The Validity team is not responsibile for any losses.`'
    +'\n\n`Source Code`'
    +'\nThis bot was developed by @xGozzy on behalf of @ValidityCrypto, to incentivize community events and activity but'
    +' also to allow seamless tips between the team and community members. It will be updated regularly to ensure maximum'
    +' efficency and security. View the source code at:'
    +' https://github.com/validitycrypto/validity-hybrid-tipbot';


module.exports.tbot = tbot = new telegraf(_tg)

tbot.hears('hi', (ctx) => ctx.reply('Hey there'))

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

tbot.command('help', async(ctx) => {
  return ctx.replyWithMarkdown(helpInfo);
})

tbot.action('help', async(ctx) => {
  return ctx.replyWithMarkdown(helpInfo);
})

tbot.command('deposit', async(ctx) => {
  var nuo = await wallet.viewAccount(ctx.message.from.username);
  return ctx.replyWithMarkdown(`@${ctx.message.from.username} your depositing address is: ` + '`' + `${nuo}` + '`');
})

tbot.action('deposit', async(ctx) => {
  var nuo = await wallet.viewAccount(ctx.callbackQuery.from.username);
  return ctx.replyWithMarkdown(`@${ctx.callbackQuery.from.username} your depositing address is: ` + '`' + `${nuo}` + '`');
})

tbot.command('withdraw', async(ctx) => {
  var callingUser = ctx.message.from.username;
  var calling0x = await wallet.proofAccount(callingUser);
  var inputParameters = ctx.message.text.split("/withdraw ").pop().split(" ");
  var target0x = inputParameters[0];

  if(inputParameters.length != 3){
    return ctx.replyWithMarkdown("⚠️  Incorrect parameter amount");
  } else if(!wallet.isAddress(target0x)){
    return ctx.replyWithMarkdown("⚠️  Incorrect EtherGem address");
  }

  if(wallet.isAddress(calling0x)){
    inputParameters[1] = await wallet.decimalLimit(inputParameters[1]);
    var parameterValidity = await wallet.proofParameters(callingUser, null,
    inputParameters[1], inputParameters[2], true)
    if(parameterValidity == true){
        var balanceValidity = await wallet.proofBalances(calling0x,
        inputParameters[1], inputParameters[2], "withdraw");
        if(balanceValidity == true){
          var tx = await wallet.withdrawFunds(calling0x,
          inputParameters[0], inputParameters[1],
          inputParameters[2]);
          if(tx != undefined){
            return ctx.replyWithMarkdown(
              `@${ctx.message.from.username} withdrew to ` + ' `'
              + `${inputParameters[0]}` + '`' +  ' of ' + ' `'
              + `${inputParameters[1]} ${inputParameters[2]}`
              + ' `' +  ' 📤',
              Extra.markup(withdrawModal(tx)));
          }
        } else {
          return ctx.replyWithMarkdown(balanceValidity);
        }
    } else {
      return ctx.replyWithMarkdown(parameterValidity);
    }
  } else {
    return ctx.replyWithMarkdown(calling0x);
  }
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
  var address = await wallet.createAccount(ctx.callbackQuery.from.username, ctx.callbackQuery.from.id);
  if(address == undefined){
    return ctx.replyWithMarkdown(`🚫 @${ctx.callbackQuery.from.username} ***you have already generated an account***`);
  } else if(address != undefined) {
    return ctx.replyWithMarkdown(`@${ctx.callbackQuery.from.username} your account address is: ` + '`' + `${address}` + '`');
  }
})

tbot.command('/commands',(ctx) => {
  return ctx.replyWithMarkdown(commandList);
})

tbot.action('commands',(ctx) => {
  return ctx.replyWithMarkdown(commandList);
})

tbot.action('praise', (ctx) => {
  return ctx.replyWithMarkdown(`@${ctx.callbackQuery.from.username} says ` + `"` + randomPraise[Math.floor(Math.random() * randomPraise.length)] + `"`);
})

tbot.command('admin', (ctx) => {
  return ctx.replyWithMarkdown(randomAdmin[Math.floor(Math.random() * randomAdmin.length)]);
})

tbot.command('facts', (ctx) => {
  return ctx.replyWithMarkdown(randomFacts[Math.floor(Math.random() * randomFacts.length)]);
})

tbot.command('/tip', async(ctx) => {
  var inputParameters = ctx.message.text.split("/tip ").pop().split(" ");

  if(inputParameters.length != 3){
    return ctx.replyWithMarkdown("⚠️  Incorrect parameter amount");
  }

  var targetUser = inputParameters[0].replace('@', '');
  var callingUser = ctx.message.from.username;
  var calling0x = await wallet.proofAccount(callingUser);
  var recieving0x;

  if(wallet.isAddress(calling0x)){
    inputParameters[1] = await wallet.decimalLimit(inputParameters[1]);
    var parameterValidity = await wallet.proofParameters(callingUser, targetUser,
    inputParameters[1], inputParameters[2], false)
    if(parameterValidity == true){
      recieving0x = await wallet.proofAccount(targetUser);
      if(wallet.isAddress(recieving0x)){
          var balanceValidity = await wallet.proofBalances(calling0x,
            inputParameters[1], inputParameters[2], false);
          if(balanceValidity == true){
            var tx = await wallet.tipUser("telegram",
            callingUser, calling0x, recieving0x,
            inputParameters[1], inputParameters[2]);
            return ctx.replyWithMarkdown(
              `@${callingUser} tipped @${targetUser} of ` + ' `' +
              `${inputParameters[1]} ${inputParameters[2]}` + ' `' +  '🎉',
              Extra.markup(transactionModal(tx)))
          } else {
            return ctx.replyWithMarkdown(balanceValidity);
          }
      } else {
        return ctx.replyWithMarkdown(recieving0x);
      }
    } else {
      return ctx.replyWithMarkdown(parameterValidity);
    }
  } else {
    return ctx.replyWithMarkdown(calling0x);
  }
})

tbot.action('fire', async(ctx) => {
  var caller = ctx.callbackQuery.from.username;
  var inputParameters = JSON.stringify(ctx.callbackQuery.message.text).split(" ");
  var callingUser = ctx.message.from.username;
  var targetUser = inputParameters[2].replace('@', '');
  var calling0x = await wallet.proofAccount(callingUser);
  var recieving0x;

  if(wallet.isAddress(calling0x)){
    inputParameters[5] = await wallet.decimalLimit(inputParameters[1]);
    var parameterValidity = await wallet.proofParameters(callingUser, targetUser,
    inputParameters[5], inputParameters[6], false)
    if(parameterValidity == true){
      recieving0x = await wallet.proofAccount(targetUser);
      if(wallet.isAddress(recieving0x)){
          var balanceValidity = await wallet.proofBalances(calling0x,
            inputParameters[5], inputParameters[6], false);
          if(balanceValidity == true){
            var tx = await wallet.tipUser("telegram",
            callingUser, calling0x, recieving0x,
            inputParameters[5], inputParameters[6]);
            return ctx.replyWithMarkdown(
              `@${callingUser} tipped @${targetUser} of ` + ' `' +
              `${inputParameters[5]} ${inputParameters[6]}` + ' `' +  '🎉',
              Extra.markup(transactionModal(tx)))
          } else {
            return ctx.answerCbQuery(balanceValidity);
          }
      } else {
        return ctx.answerCbQuery(recieving0x);
      }
    } else {
      return ctx.answerCbQuery(parameterValidity);
    }
  } else {
    return ctx.answerCbQuery(calling0x);
  }
});

tbot.command('/rain', async(ctx) => {
  var inputParameters = ctx.message.text.split("/rain ").pop().split(" ");

  if(inputParameters.length != 2){
    return ctx.replyWithMarkdown("⚠️  Incorrect parameter amount");
  }

  var callingUser = ctx.message.from.username;
  var calling0x = await wallet.proofAccount(callingUser);

  if(wallet.isAddress(calling0x)){
    inputParameters[0] = await wallet.decimalLimit(inputParameters[0]);
    var parameterValidity = await wallet.proofParameters(callingUser, null,
    inputParameters[0], inputParameters[1], true)
    if(parameterValidity == true){
          var balanceValidity = await wallet.proofBalances(calling0x,
          inputParameters[0], inputParameters[1], true);
          if(balanceValidity == true){
            var rainedUsers = await wallet.tipRain("telegram",
            callingUser, calling0x, inputParameters[0],
            inputParameters[1]);
            if(rainedUsers.length > 0){
              return ctx.replyWithMarkdown(
                `@${callingUser} rained `
                +`@${rainedUsers[0]}, @${rainedUsers[1]}, `
                +`@${rainedUsers[2]}, @${rainedUsers[3]} and `
                +`@${rainedUsers[4]} of ` + ' `' + `${inputParameters[0]} `
                +`${inputParameters[1]}` + ' `' +  '💥');
            } else if(users.length == 0){
              return ctx.replyWithMarkdown('⚠️ No users active to rain');
            }
          } else {
            return ctx.replyWithMarkdown(balanceValidity);
          }
    } else {
      return ctx.replyWithMarkdown(parameterValidity);
    }
  } else {
    return ctx.replyWithMarkdown(calling0x);
  }
})
