const constants = require('./utils/constants.js');
const telegramApi = require('telegraf/telegram');
const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const wallet = require('./wallet.js');
const telegraf = require('telegraf');

const tbot = new telegraf("");

const transactionModal  = (_hash) => Markup.inlineKeyboard([
  Markup.urlButton('🔗 Tx',`https://etherscan.io/tx/${_hash}`),
  Markup.callbackButton('🔥 Tip', 'fire')
])

const withdrawModal  = (_hash) => Markup.inlineKeyboard([
  Markup.urlButton('🔗 Tx',`https://etherscan.io/tx/${_hash}`),
  Markup.callbackButton('🙌 Praise', 'praise')
])

const menuModal = Markup.inlineKeyboard([
  [ Markup.callbackButton('🏆 Leaderboard', 'leaderboard')],
  [ Markup.callbackButton('🍀 Generate', 'generate'),
    Markup.callbackButton('💰 Balance', 'balance') ],
  [ Markup.callbackButton('⚡️ Deposit', 'deposit') ,
    Markup.callbackButton('⚒ Commands', 'commands') ],
  [ Markup.callbackButton('⭐️ Help', 'help'),
    Markup.urlButton('🌐 Website', 'https://vldy.org') ]
])

module.exports.initialiseTelegram = initialiseTelegram = async(_token) => {
   await tbot.launch();

 }


commandLimit = async(_id) => {
  var commandLimitor = await wallet.getCall(_id);
  var currentTime = new Date();
  if(commandLimitor < currentTime.getTime() || commandLimitor == undefined){
    return true;
  } else {
    return false;
  }
}

tbot.hears('hi', async(ctx) => ctx.reply('Hey there'))

tbot.start((ctx) => ctx.replyWithMarkdown(
  '🌀 ***Welcome to the Validity (VDLY) Hybrid tipbot*** 🌀'
   + '\n\nCompatible across `Discord` and `Telegram` 💜💙'
   + '\n\nTo start, generate an account to start tipping!'
   + '\nFor more info check out @ValidityCrypto ✅'
   + '\nMost importantly, have fun.'
   + '\n\nCreated by @xGozzy'
,Extra.markup(menuModal)))

tbot.command('leaderboard', async(ctx) => {
  if(await commandLimit(ctx.message.from.id) == true){
  await wallet.logCall(ctx.message.from.id);

  var token = await wallet.tokenTotal("telegram");
  var gas = await wallet.gasTotal("telegram");
  return ctx.replyWithMarkdown(
    '**🔹** ***Ethereum*** **🔹**'
    +'\n\n***1:*** ' + `@${gas[0]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(gas[gas[0]])}` + '`' + '` ETH`'
    +'\n***2:*** ' + `@${gas[1]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(gas[gas[1]])}` + '`' + '` ETH`'
    +'\n***3:*** ' + `@${gas[2]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(gas[gas[2]])}` + '`' + '` ETH`'
    +'\n***4:*** ' + `@${gas[3]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(gas[gas[3]])}` + '`' + '` ETH`'
    +'\n***5:*** ' + `@${gas[4]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(gas[gas[4]])}` + '`' + '` ETH`'

    +'\n🌀 ***Validity*** 🌀'
    +'\n\n***1:*** ' + `@${token[0]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(token[token[0]])}` + '`' + '` VLDY`'
    +'\n***2:*** ' + `@${token[1]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(token[token[1]])}` + '`' + '` VLDY`'
    +'\n***3:*** ' + `@${token[2]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(token[token[2]])}` + '`' + '` VLDY`'
    +'\n***4:*** ' + `@${token[3]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(token[token[3]])}` + '`' + '` VLDY`'
    +'\n***5:*** ' + `@${token[4]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(token[token[4]])}` + '`' + '` VLDY`');
}
})

tbot.action('leaderboard', async(ctx) => {
  if(await commandLimit(ctx.callbackQuery.from.id) == true){
  await wallet.logCall(ctx.callbackQuery.from.id);
  var token = await wallet.tokenTotal("telegram");
  var gas = await wallet.gasTotal("telegram");
  return ctx.replyWithMarkdown(
  '**🔹	** ***Ethereum*** **🔹	**'
  +'\n\n***1:*** ' + `@${gas[0]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(gas[gas[0]])}` + '`' + '` ETH`'
  +'\n***2:*** ' + `@${gas[1]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(gas[gas[1]])}` + '`' + '` ETH`'
  +'\n***3:*** ' + `@${gas[2]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(gas[gas[2]])}` + '`' + '` ETH`'
  +'\n***4:*** ' + `@${gas[3]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(gas[gas[3]])}` + '`' + '` ETH`'
  +'\n***5:*** ' + `@${gas[4]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(gas[gas[4]])}` + '`' + '` ETH`'

  +'\n🌀 ***Validity*** 🌀'
  +'\n\n***1:*** ' + `@${token[0]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(token[token[0]])}` + '`' + '` VLDY`'
  +'\n***2:*** ' + `@${token[1]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(token[token[1]])}` + '`' + '` VLDY`'
  +'\n***3:*** ' + `@${token[2]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(token[token[2]])}` + '`' + '` VLDY`'
  +'\n***4:*** ' + `@${token[3]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(token[token[3]])}` + '`' + '` VLDY`'
  +'\n***5:*** ' + `@${token[4]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(token[token[4]])}` + '`' + '` VLDY`');
}
})

tbot.command('balance', async(ctx) => {
  if(await commandLimit(ctx.message.from.id) == true){
  await wallet.logCall(ctx.message.from.id);
  var account = await wallet.viewAccount(ctx.message.from.username);
  if(account == undefined){
    return ctx.replyWithMarkdown('⚠️ ***Please generate an account first by using the command:*** `/generate`');
  } else {
    var token = await wallet.tokenbalance(account);
    var gas = await wallet.gasBalance(account);
    return ctx.replyWithMarkdown(`@${ctx.message.from.username}'s funds: ` + ` **🔹	**` + '`' +  ` ${wallet.presentNumber(gas, true)}`
    + ' ETH ' + '`' + ` 🌀`  + '`' + ` ${wallet.presentNumber(token, false)}`  + ' VLDY' + '`');
    }
  }
})

tbot.action('balance' , async(ctx) => {
  if(await commandLimit(ctx.callbackQuery.from.id) == true){
  await wallet.logCall(ctx.callbackQuery.from.id);
  var account = await wallet.viewAccount(ctx.callbackQuery.from.username);
  if(account == undefined){
    return ctx.replyWithMarkdown('⚠️ ***Please generate an account first by using the command:*** `/generate`');
  } else {
    var token = await wallet.tokenbalance(account);
    var gas = await wallet.gasBalance(account);

    return ctx.replyWithMarkdown(`@${ctx.message.from.username}'s funds: ` + ` **🔹	**` + '`' +  ` ${wallet.presentNumber(gas, true)}`
    + ' ETH ' + '`' + ` 🌀`  + '`' + ` ${wallet.presentNumber(token, false)}`  + ' VLDY' + '`');
    }
  }
})

tbot.command('help', async(ctx) => {
  if(await commandLimit(ctx.message.from.id) == true){
  await wallet.logCall(ctx.message.from.id);
  return ctx.replyWithMarkdown(constants.helpInfo);
  }
})

tbot.command('validation', async(ctx) => {
  if(await commandLimit(ctx.message.from.id) == true){
    await wallet.logCall(ctx.message.from.id);
    const currentEvent = await wallet.validationMetadata();

    return ctx.replyWithMarkdown(
      `\n 🔹 ***Active Validation*** ` + `\n` +
      constants.validationInfo(currentEvent));
  }
})

tbot.action('help', async(ctx) => {
  if(await commandLimit(ctx.callbackQuery.from.id) == true){
  await wallet.logCall(ctx.callbackQuery.from.id);
  return ctx.replyWithMarkdown(constants.helpInfo);
  }
})

tbot.command('stats', async(ctx) => {
  if(await commandLimit(ctx.message.from.id) == true){
  await wallet.logCall(ctx.message.from.id);
  var token = await wallet.tokenTotal("telegram");
  var gas = await wallet.gasTotal("telegram");
  return ctx.replyWithMarkdown(`@${ctx.message.from.username}'s stats:'`
    + `\n**🔹	** ` + `${wallet.presentNumber(gas[ctx.message.from.username])} ETH `
    + `\n🌀 ` + `${wallet.presentNumber(token[ctx.message.from.username])} VLDY`);
  }
})

tbot.action('stats', async(ctx) => {
  if(await commandLimit(ctx.callbackQuery.from.id) == true){
  await wallet.logCall(ctx.callbackQuery.from.id);
  var token = await wallet.tokenTotal("telegram");
  var gas = await wallet.gasTotal("telegram");
  return ctx.replyWithMarkdown(`@${ctx.callbackQuery.from.username}'s stats:'`
    `\n**🔹	** ` + `${wallet.presentNumber(gas[ctx.callbackQuery.from.username])} ETH `
    + `\n🌀 ` + `${wallet.presentNumber(token[ctx.callbackQuery.from.username])} VLDY`);
  }
})

tbot.command('allowance', async(ctx) => {
  if(await commandLimit(ctx.message.from.id) == true){
  await wallet.logCall(ctx.message.from.id);

  var userAccount = await wallet.viewAccount(ctx.message.from.username);
  var currentallowance = await wallet.approved(userAccount);

  return ctx.replyWithMarkdown(`@${ctx.message.from.username}'s allowance:  🌀` + '`' + ` ${wallet.presentNumber(currentallowance)} VLDY`+ '`');
  }
})

tbot.command('deposit', async(ctx) => {
  if(await commandLimit(ctx.message.from.id) == true){
  await wallet.logCall(ctx.message.from.id);
  var nuo = await wallet.viewAccount(ctx.message.from.username);
  return ctx.replyWithMarkdown(`@${ctx.message.from.username} your depositing address is:` + '`' +  `${nuo}` + '`');
  }
})

tbot.action('deposit', async(ctx) => {
  if(await commandLimit(ctx.callbackQuery.from.id) == true){
  await wallet.logCall(ctx.callbackQuery.from.id);
  var nuo = await wallet.viewAccount(ctx.callbackQuery.from.username);
  return ctx.replyWithMarkdown(`@${ctx.message.from.username} your depositing address is:` + '`' +  `${nuo}` + '`');
  }
})

tbot.command('withdraw', async(ctx) => {
  if(await commandLimit(ctx.message.from.id) == true){
  await wallet.logCall(ctx.message.from.id);
  var callingUser = ctx.message.from.username;
  var calling0x = await wallet.proofAccount(callingUser);
  var inputParameters = ctx.message.text.split("/withdraw ").pop().split(" ");
  var target0x = inputParameters[0];

  if(inputParameters.length != 3){
    return ctx.replyWithMarkdown("⚠️  Incorrect parameter amount");
  } else if(!wallet.isAddress(target0x)){
    return ctx.replyWithMarkdown("⚠️  Incorrect Ethereum address");
  }

  if(await wallet.isAddress(calling0x) == true){
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
            return ctx.reply(
              `@${ctx.message.from.username} withdrew to `
              + `${inputParameters[0]}` +  ' of '
              + `${wallet.presentNumber(inputParameters[1])} ${inputParameters[2]}`
              +  ' 📤',
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
}
})

tbot.command('generate', async(ctx) => {
  if(await commandLimit(ctx.message.from.id) == true){
    await wallet.logCall(ctx.message.from.id);
    if(ctx.message.from.username != undefined){
      var address = await wallet.createAccount(ctx.message.from.username, ctx.message.from.id);
      if(address == undefined){
        return ctx.reply(`🚫 @${ctx.message.from.username} you have already generated an account`);
      } else if(address != undefined) {
        return ctx.reply(`@${ctx.message.from.username} your account address is: ` + `${address}`);
    }
} else {
  return ctx.reply('⚠️ Please set a telegram username');
  }
 }
})

tbot.action('generate', async(ctx) => {
  if(await commandLimit(ctx.callbackQuery.from.id) == true){
  await wallet.logCall(ctx.callbackQuery.from.id);
  if(ctx.callbackQuery.from.username != undefined){
    var address = await wallet.createAccount(ctx.callbackQuery.from.username, ctx.callbackQuery.from.id);
    if(address == undefined){
      return ctx.reply(`🚫 @${ctx.callbackQuery.from.username} you have already generated an account`);
    } else if(address != undefined) {
      return ctx.reply(`@${ctx.callbackQuery.from.username} your account address is: ` + `${address}`);
    }
  } else {
    return ctx.reply('⚠️ Please set a telegram username');
  }
 }
})

tbot.command('/commands',async(ctx) => {
  if(await commandLimit(ctx.message.from.id) == true){
  await wallet.logCall(ctx.message.from.id);
  return ctx.replyWithMarkdown(constants.commandList);
  }
})

tbot.action('commands', async(ctx) => {
  if(await commandLimit(ctx.callbackQuery.from.id) == true){
  await wallet.logCall(ctx.callbackQuery.from.id);
  return ctx.replyWithMarkdown(constants.commandList);
  }
})

tbot.command('/approve', async(ctx) => {
  if(await commandLimit(ctx.message.from.id) == true){
  await wallet.logCall(ctx.message.from.id);

  var inputParameters = ctx.message.text.split("/approve ").pop().split(" ");

  if(inputParameters.length != 1){
    return ctx.replyWithMarkdown("⚠️ Incorrect parameter amount");
  }

  var callingUser = ctx.message.from.username;
  var calling0x = await wallet.proofAccount(callingUser);

  if(await wallet.isAddress(calling0x) == true){
     var inputValidity = await wallet.proofNumber(inputParameters[0]);
     inputParameters[0] = await wallet.decimalLimit(inputParameters[0]);
     if(!inputValidity){
       return ctx.replyWithMarkdown('⚠️ Not a number');
     }  var gas = await wallet.gasBalance(calling0x);
     if(gas > 0.00015){
      var tx = await wallet.approveTokens(calling0x, inputParameters[0]);
     if(tx != undefined){
       return ctx.replyWithMarkdown('Approval confrimed',
       Extra.markup(withdrawModal(tx)));
     } else {
       return ctx.replyWithMarkdown('⚠️ Error could approve');
     }
   } else {
     return ctx.replyWithMarkdown('⚠️ No gas to approve');
   }
  } else {
    return ctx.replyWithMarkdown(calling0x);
  }
 }
})

tbot.action('praise', async(ctx) => {
  if(await commandLimit(ctx.callbackQuery.from.id) == true){
  await wallet.logCall(ctx.callbackQuery.from.id);
  return ctx.reply(`@${ctx.callbackQuery.from.username} says ` + `"` + constants.randomPraise[Math.floor(Math.random() * constants.randomPraise.length)] + `"`);
}
})

tbot.command('admin', async(ctx) => {
  if(await commandLimit(ctx.message.from.id) == true){
  await wallet.logCall(ctx.message.from.id);
  return ctx.replyWithMarkdown(constants.randomAdmin[Math.floor(Math.random() * constants.randomAdmin.length)]);
}
})

tbot.command('facts', async(ctx) => {
  if(await commandLimit(ctx.message.from.id) == true){
  await wallet.logCall(ctx.message.from.id);
  return ctx.replyWithMarkdown(constants.randomFacts[Math.floor(Math.random() * constants.randomFacts.length)]);
 }
})

tbot.command('/tip', async(ctx) => {
  if(await commandLimit(ctx.message.from.id) == true){
  await wallet.logCall(ctx.message.from.id);
  var inputParameters = ctx.message.text.split("/tip ").pop().split(" ");

  if(inputParameters.length != 3){
    return ctx.reply("⚠️  Incorrect parameter amount");
  }

  var targetUser = inputParameters[0].replace('@', '');
  var callingUser = ctx.message.from.username;
  var calling0x = await wallet.proofAccount(callingUser);
  var recieving0x;

  if(await wallet.isAddress(calling0x) == true){
    inputParameters[1] = await wallet.decimalLimit(inputParameters[1]);
    var parameterValidity = await wallet.proofParameters(callingUser, targetUser,
    inputParameters[1], inputParameters[2], false)
    if(parameterValidity == true){
      recieving0x = await wallet.proofAccount(targetUser);
      if(await wallet.isAddress(recieving0x) == true){
          var balanceValidity = await wallet.proofBalances(calling0x,
            inputParameters[1], inputParameters[2], false);
          if(balanceValidity == true){
            var tx = await wallet.tipUser("telegram",
            callingUser, calling0x, recieving0x,
            inputParameters[1], inputParameters[2]);
            return ctx.reply(
              `@${callingUser} tipped @${targetUser} of ` +
              `${wallet.presentNumber(inputParameters[1])} ${inputParameters[2]}` + ' 🎉',
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
 }
})

tbot.action('fire', async(ctx) => {
  if(await commandLimit(ctx.callbackQuery.from.id) == true){
  await wallet.logCall(ctx.callbackQuery.from.id);
  var inputParameters = JSON.stringify(ctx.callbackQuery.message.text).split(" ");
  var callingUser = ctx.callbackQuery.from.username;
  var targetUser = inputParameters[2].replace('@', '');
  var calling0x = await wallet.proofAccount(callingUser);
  var recieving0x;

  if(await wallet.isAddress(calling0x) == true){
    inputParameters[4] = await wallet.decimalLimit(inputParameters[4]);
    var parameterValidity = await wallet.proofParameters(callingUser, targetUser,
    inputParameters[4], inputParameters[5], false)
    if(parameterValidity == true){
      recieving0x = await wallet.proofAccount(targetUser);
      if(await wallet.isAddress(recieving0x) == true){
          var balanceValidity = await wallet.proofBalances(calling0x,
            inputParameters[4], inputParameters[5], false);
          if(balanceValidity == true){
            var tx = await wallet.tipUser("telegram",
            callingUser, calling0x, recieving0x,
            inputParameters[4], inputParameters[5]);
            return ctx.reply(
              `@${callingUser} tipped @${targetUser} of ` +
              `${wallet.presentNumber(inputParameters[4])} ${inputParameters[5]}` +  ' 🎉',
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
}
});

tbot.command('/rain', async(ctx) => {
  if(await commandLimit(ctx.message.from.id) == true){
  await wallet.logCall(ctx.message.from.id);
  var inputParameters = ctx.message.text.split("/rain ").pop().split(" ");

  if(inputParameters.length != 2){
    return ctx.reply("⚠️  Incorrect parameter amount");
  }

  var callingUser = ctx.message.from.username;
  var calling0x = await wallet.proofAccount(callingUser);

  if(await wallet.isAddress(calling0x) == true){
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
            if(rainedUsers.users.length > 0){
              var x = 0;
              var finalParse = "";
              while(x < rainedUsers.users.length){
                if(x == rainedUsers.users.length-1 && x != 0){ finalParse =  finalParse + ' and '; }
                else if(x != 0 && rainedUsers.users.length > 1 ){ finalParse = finalParse + ', '; }
                finalParse = finalParse + `@${rainedUsers.users[x]}`;
                x++;
              }
              return ctx.reply(
                `@${callingUser} rained `
                + `${finalParse}` + ` of ` + `${wallet.presentNumber(inputParameters[0])} `
                +`${inputParameters[1]}` +  '💥',
                Extra.markup(withdrawModal(rainedUsers.tx)));
            } else if(rainedUsers.users.length == 0){
              return ctx.reply('⚠️ No users active to rain');
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
}
})
