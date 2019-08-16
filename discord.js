const constants = require('./utils/constants.js');
const telegramApi = require('telegraf/telegram');
const wallet = require('./wallet.js');
const Discord = require('discord.js');
const client = new Discord.Client();

module.exports.initialiseDiscord = initialiseDiscord = async(_token) => {
  await client.login(_token);
}

client.on('ready', async() => {
  console.log(`Logged in as ${client.user.tag}!`);
})

client.on('error', (error) => console.log);

commandLimit = async(_id) => {
  var commandLimitor = await wallet.getCall(_id);
  var currentTime = new Date();
  if(commandLimitor < currentTime.getTime() || commandLimitor == undefined){
    await wallet.logCall(_id);
    return true;
  } else {
    return false;
  }
}

commandGenerate = async(_msg) => {
  var address = await wallet.createAccount(_msg.author.username, _msg.author.id);
  if(address == undefined){
    _msg.channel.send(`🚫 <@!${_msg.author.id}>` + ` you have already generated an account`);
  } else if(address != undefined) {
    _msg.channel.send(`<@!${_msg.author.id}>` + ` your account address is: ` + '`' + `${address}` + '`');
  }
}

commandBalance = async(_msg) => {
  var account = await wallet.viewAccount(_msg.author.username);
  if(account == undefined){
    return _msg.channel.send(`⚠️ <@!${_msg.author.id}>` + ' please generate an account first by using the command: `/generate` ');
  } else {
    var token = await wallet.tokenbalance(account);
    var gas = await wallet.gasBalance(account);
    return _msg.channel.send(`<@!${_msg.author.id}>` + ' your funds are: ' + '<:eth:609363090450153522>' + '`' + ` ${wallet.presentNumber(gas, true)}`
    + ` ETH ` + '`' + ' <:vldy:490221401232506882> ' + '`' + ` ${wallet.presentNumber(token)}` + ` VLDY` + '`');
  }
}

commandDeposit = async(_msg) => {
  var account = await wallet.viewAccount(_msg.author.username);
  if(account == undefined){
    return _msg.channel.send(`⚠️ <@!${_msg.author.id}>` + ' please generate an account first by using the command: `/generate`');
  } else {
    var token = await wallet.tokenbalance(account);
    var gas = await wallet.gasBalance(account);
    return _msg.channel.send(`<@!${_msg.author.id}> your depositing address is: ` + '`' + `${account}` + '`');
  }
}

commandLeaderboard = async(_msg) => {
  var token = await wallet.tokenTotal("discord");
  var gas = await wallet.gasTotal("discord");
  const embed = new Discord.RichEmbed()
      .setColor(constants.prefixColors[Math.floor(Math.random() * constants.prefixColors.length)])
      .setDescription(
        '\n<:eth:609363090450153522> **Ethereum** <:eth:609363090450153522>'
        +'\n\n***1:*** ' + `@${gas[0]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(gas[gas[0]])}` + ' ETH`'
        +'\n***2:***  ' + `@${gas[1]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(gas[gas[1]])}` + ' ETH`'
        +'\n***3:***  ' + `@${gas[2]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(gas[gas[2]])}` + ' ETH`'
        +'\n***4:***  ' + `@${gas[3]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(gas[gas[3]])}` + ' ETH`'
        +'\n***5:***  ' + `@${gas[4]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(gas[gas[4]])}` + ' ETH`'

        +'\n\n<:vldy:490221401232506882> **Validity** <:vldy:490221401232506882>'
        +'\n\n***1:***  ' + `@${token[0]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(token[token[0]])}` + ' VLDY`'
        +'\n***2:***  ' + `@${token[1]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(token[token[1]])}` + ' VLDY`'
        +'\n***3:***  ' + `@${token[2]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(token[token[2]])}` + ' VLDY`'
        +'\n***4:***  ' + `@${token[3]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(token[token[3]])}` + ' VLDY`'
        +'\n***5:***  ' + `@${token[4]}` + ' ***-*** ' + '`' + `${wallet.presentNumber(token[token[4]])}` + ' VLDY`'
      )
      .setAuthor("🏆 Leaderboard")
  return _msg.channel.send({ embed });
}

commandTip = async(_msg) => {
    var inputParameters = _msg.content.split("/tip ").pop().split(" ");

    if(inputParameters.length != 3){
      return _msg.channel.send("⚠️ Incorrect parameter amount ");
    }

    var targetUser = await wallet.getUsername(inputParameters[0].toString().replace(/[@<>]/g,''));
    var callingUser = _msg.author.username;
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
              var tx = await wallet.tipUser("discord",
              callingUser, calling0x, recieving0x,
              inputParameters[1], inputParameters[2]);
              const embed = new Discord.RichEmbed()
                  .setTitle("🔗 Transaction")
                  .setColor(constants.prefixColors[Math.floor(Math.random() * constants.prefixColors.length)])
                  .setDescription(
                    `<@!${_msg.author.id}> tipped `+
                    `${inputParameters[0]} of ` + ' `'
                    + `${wallet.presentNumber(inputParameters[1])} ${inputParameters[2]}` + ' `' +  ' 🎉'
                  )
                  .setURL(`https://etherscan.io/tx/${tx}`)
              return _msg.channel.send({ embed });
            } else {
              return _msg.channel.send(balanceValidity);
            }
        } else {
          return _msg.channel.send(recieving0x);
        }
      } else {
        return _msg.channel.send(parameterValidity);
      }
    } else {
      return _msg.channel.send(calling0x);
    }
}

commandRain = async(_msg) => {
  var inputParameters = _msg.content.split("/rain ").pop().split(" ");

  if(inputParameters.length != 2){
    return _msg.channel.send("⚠️ Incorrect parameter amount ");
  }

  var callingUser = _msg.author.username;
  var calling0x = await wallet.proofAccount(callingUser);

    if(wallet.isAddress(calling0x)){
      inputParameters[0] = await wallet.decimalLimit(inputParameters[0]);
      var parameterValidity = await wallet.proofParameters(callingUser, null,
      inputParameters[0], inputParameters[1], true)
      if(parameterValidity == true){
            var balanceValidity = await wallet.proofBalances(calling0x,
            inputParameters[0], inputParameters[1], true);
            if(balanceValidity == true){
              var rainedUsers = await wallet.tipRain("discord",
              callingUser, calling0x, inputParameters[0],
              inputParameters[1]);
              if(rainedUsers.users.length > 0){
                var x = 0;
                var finalParse = "";
                while(x < rainedUsers.users.length){
                  if(x == rainedUsers.users.length-1 && x != 0){ finalParse =  finalParse + ' and '; }
                  else if(x != 0 && rainedUsers.users.length > 1 ){ finalParse = finalParse + ', '; }
                  finalParse = finalParse + `<@!${(await wallet.getID(rainedUsers.users[x])).toString().replace(/[v]/g,'')}>`;
                  x++;
                }
                const embed = new Discord.RichEmbed()
                    .setTitle("🔗 Transaction")
                    .setColor(constants.prefixColors[Math.floor(Math.random() * constants.prefixColors.length)])
                    .setDescription(
                      `<@!${_msg.author.id}> rained `
                      + `${finalParse}` + ` of ` + ' `' + `${wallet.presentNumber(inputParameters[0])} `
                      +`${inputParameters[1]}` + ' `' +  '💥'
                    )
                    .setURL(`https://etherscan.io/tx/${rainedUsers.tx}`)
                return _msg.channel.send({ embed });
              } else {
                return _msg.channel.send('⚠️ No users active to rain');
              }
            } else {
              return _msg.channel.send(balanceValidity);
            }
      } else {
        return _msg.channel.send(parameterValidity);
      }
    } else {
      return _msg.channel.send(calling0x);
    }
}

commandWithdraw = async(_msg) => {
  var calling0x = await wallet.proofAccount(_msg.author.username);
  var inputParameters = _msg.content.split("/withdraw ").pop().split(" ");
  var target0x = inputParameters[0];

  if(inputParameters.length != 3){
    return _msg.channel.send("⚠️  Incorrect parameter amount");
  } else if(!wallet.isAddress(target0x)){
    return _msg.channel.send("⚠️  Incorrect Ethereum address");
  }

  if(wallet.isAddress(calling0x)){
    inputParameters[1] = await wallet.decimalLimit(inputParameters[1]);
    var parameterValidity = await wallet.proofParameters(_msg.author.username, null,
    inputParameters[1], inputParameters[2], true)
    if(parameterValidity == true){
        var balanceValidity = await wallet.proofBalances(calling0x,
        inputParameters[1], inputParameters[2], "withdraw");
        if(balanceValidity == true){
          var tx = await wallet.withdrawFunds(calling0x,
          inputParameters[0], inputParameters[1],
          inputParameters[2]);
          if(tx != undefined){
              const embed = new Discord.RichEmbed()
                  .setTitle("🔗 Transaction")
                  .setColor(constants.prefixColors[Math.floor(Math.random() * constants.prefixColors.length)])
                  .setDescription(
                    `<@!${_msg.author.id}> withdrew to ` + ' `'
                    + `${inputParameters[0]}` + '`' +  ' of ' + ' `'
                    + `${wallet.presentNumber(inputParameters[1])} ${inputParameters[2]}`
                    + ' `' +  ' 📤')
                    .setURL(`https://etherscan.io/tx/${tx}`)
              return _msg.channel.send({ embed });
          }
        } else {
          return _msg.channel.send(balanceValidity);
        }
    } else {
      return _msg.channel.send(parameterValidity);
    }
  } else {
    return _msg.channel.send(calling0x);
  }
}

commandStats = async(_msg) => {
  var token = await wallet.tokenTotal("discord");
  var gas = await wallet.gasTotal("discord");
  const embed = new Discord.RichEmbed()
      .setColor(constants.prefixColors[Math.floor(Math.random() * constants.prefixColors.length)])
      .setDescription(
      `<:eth:609363090450153522> ` + '`' + `${wallet.presentNumber(gas[_msg.author.username])} ETH `  + '`'
      + `\n <:vldy:490221401232506882> `  + '`' + `${wallet.presentNumber(token[_msg.author.username])} VLDY`  + '`')
      .setAuthor(`⭐ ${_msg.author.username}'s stats`, _msg.author.displayAvatarURL)
  return _msg.channel.send({ embed });
}

commandOveriew = async(_msg) => {
  const embed = new Discord.RichEmbed()
      .setColor(constants.prefixColors[Math.floor(Math.random() * constants.prefixColors.length)])
      .setDescription(constants.commandList)
      .setAuthor("🛠️ Commands")
  return _msg.channel.send({ embed });
}

commandHelp= async(_msg) => {
  const embed = new Discord.RichEmbed()
      .setColor(constants.prefixColors[Math.floor(Math.random() * constants.prefixColors.length)])
      .setDescription(constants.aboutInfo1)
      .setAuthor("⭐️ Help")
  return _msg.channel.send({ embed });
}

commandValidation = async(_msg) => {
  const currentEvent = await wallet.validationMetadata();
  const embed = new Discord.RichEmbed()
      .setColor(constants.prefixColors[Math.floor(Math.random() * constants.prefixColors.length)])
      .setDescription(constants.validationInfo(currentEvent))
      .setAuthor("🔹Active Validation")
  return _msg.channel.send({ embed });
}

commandAbout= async(_msg) => {
  const embed = new Discord.RichEmbed()
      .setColor(constants.prefixColors[Math.floor(Math.random() * constants.prefixColors.length)])
      .setDescription(constants.aboutInfo2)
      .setAuthor("🔍 About")
  return _msg.channel.send({ embed });
}

commandApprove= async(_msg) => {
  var inputParameters = _msg.content.split("/approve ").pop().split(" ");

  if(inputParameters.length != 1){
    return _msg.channel.send("⚠️ Incorrect parameter amount");
  }

  var callingUser = _msg.author.username;
  var calling0x = await wallet.proofAccount(callingUser);

  if(await wallet.isAddress(calling0x) == true){
    var inputValidity = await wallet.proofNumber(inputParameters[0]);
    inputParameters[0] = await wallet.decimalLimit(inputParameters[0]);
    if(!inputValidity){
      return _msg.channel.send('⚠️ Not a number');
    }  var gas = await wallet.gasBalance(calling0x);
    if(gas > 0.00015){
     var tx = await wallet.approveTokens(calling0x, inputParameters[0]);
     if(tx != undefined){
       const embed = new Discord.RichEmbed()
           .setTitle("🔗 Transaction")
           .setColor(constants.prefixColors[Math.floor(Math.random() * constants.prefixColors.length)])
           .setDescription('Successfully approved')
           .setURL(`https://etherscan.io/tx/${tx}`)
       return _msg.channel.send({ embed });
     } else {
       return _msg.channel.send('⚠️ Error could not approve');
     }
   } else {
     return _msg.channel.send('⚠️ No gas to approve');
   }
  } else {
    return _msg.channel.send(calling0x);
  }
}

commandAllowence = async(_msg) => {
    var userAccount = await wallet.viewAccount(_msg.author.username);
    var currentAllowence = await wallet.approved(userAccount);
    return _msg.channel.send(`<@!${_msg.author.id}>'s allowence: ` + '`' + `${wallet.presentNumber(currentAllowence)} VLDY` + '`' + ` <:vldy:490221401232506882>`);
}

client.on('message', async(msg) => {

  if(await commandLimit(msg.author.id) == true){
  await wallet.logCall(msg.author.id);

  if(msg.content === '/admin') return msg.channel.send(constants.randomAdmin[Math.floor(Math.random() * constants.randomAdmin.length)]);
  else if(msg.content === '/facts') return msg.channel.send(constants.randomFacts[Math.floor(Math.random() * constants.randomFacts.length)]);
  else if(msg.conent === '/praise') return msg.channel.send(constants.randomPraise[Math.floor(Math.random() * constants.randomPraise.length)]);
  else if(msg.content.split(" ")[0] === '/withdraw') return commandWithdraw(msg);
  else if(msg.content.split(" ")[0] === '/approve') return commandApprove(msg);
  else if(msg.content.split(" ")[0] === '/rain') return commandRain(msg);
  else if(msg.content.split(" ")[0] === '/tip') return commandTip(msg);
  else if(msg.content === '/generate')  return commandGenerate(msg);
  else if(msg.content === '/balance')  return commandBalance(msg);
  else if(msg.content === '/leaderboard') return commandLeaderboard(msg);
  else if(msg.content === '/deposit')  return commandDeposit(msg);
  else if(msg.content === '/stats') return commandStats(msg);
  else if(msg.content === '/help') return commandHelp(msg);
  else if(msg.content === '/commands') return commandOveriew(msg);
  else if(msg.content === '/validation') return commandValidation(msg);
  else if(msg.content === '/about') return commandAbout(msg);
  else if(msg.content === '/allowance') return commandAllowence(msg);
}

});
