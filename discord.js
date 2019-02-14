const Discord = require('discord.js');
const client = new Discord.Client();

const wallet = require('./wallet.js');

const prefixColors = [ 851823, 7277823, 15273215, 65535, 16711808, 16753920, 16777215 , 16776960,  255 ]

const randomAdmin = [
  'The simulacrum is never that which conceals the truth—it is the truth which conceals that there is none. \n The simulacrum is true.',
  'I have a marketing proposal for your ICO admin 🗣',
  'Blah, blah, blah, blah, BLAH!',
  'Hyperreality or reality?',
  'This is my turf dude 👊',
  `STOP YO SHILLIN' 😡`,
  'Get me some sugar',
  'We are good hun',
  `Y'all crazy ⏰`,
  'NOCOINER ALERT',
  'REEEEEEEEEEEE',
  'normie',
  'OOOF',
  'SCEM',
  'muh',
  'rofl',
  'kek'
];

const randomPraise = [
  'License and registration please 🔦 ',
  'But where is my tip?',
  'YEEEEEEAAAAHHHHH',
  'Seven blessings!',
  'Wen deposit? 👀',
  'Hallelujah! 👏',
  'For Nakamoto?',
  'For Isengard!',
  'YEEEEEEEET',
  'HODL',
  'pl0x'
];

const randomFacts = [
  'PoS (Proof of Stake) can be highly centralised, with the ability of a master public key which "solves" the nothing at stake condumrum, but at the cost of centralisation',
  `There is a collective of miners utilising their combined hashpower to crack every existing Bitcoin private key using brute force, known as the Large Bitcoin Collider`,
  `In the year 2017, 81% of all ICO's were amoral or inaffective, which resulted up to €300,0000,000 lost`,
  'A high TPS (Transactions per second) throughput, unfortunately means centralisation is immient',
  'ICOBench has a pay-per-review tiered system, with the more you bid the better the rating you get',
  `There is over 32 BTC to be won, if one can solve Satoshi's puzzle transactions`,
  'The majority of TRX dApps only orientate towards on gambling use-cases',
  'Approximately 61% of the EOS supply resides in 100 addresses',
  'Over 80% of the tops pairs on CMC are washedtraded'
];

const helpInfo =
    '\n`Command parameters`'
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

const aboutInfo =
    '\n`Fees and gas dependency`'
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

module.exports.initialiseDiscord = initialiseDiscord = async(_token) => {
  await client.login(_token);

client.on('ready', async() => {
  await wallet.initialiseDatabase();
  console.log(`Logged in as ${client.user.tag}!`);
});

commandLimit = async(_id) => {
  var commandLimitor = await wallet.getCall(_id);
  var currentTime = new Date();
  console.log(commandLimitor , currentTime.getTime());
  console.log(commandLimitor < currentTime.getTime() || commandLimitor == undefined)
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
    return _msg.channel.send(`<@!${_msg.author.id}>` + ' your funds are: ' + '<:ethergem:490221755756183554>' + '`' + ` ${gas}`
    + ` EGEM ` + '`' + ' <:validity:490221401232506882> ' + '`' + ` ${token}` + ` VLDY` + '`');
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
      .setColor(prefixColors[Math.floor(Math.random() * prefixColors.length)])
      .setDescription(
        '\n<:ethergem:490221755756183554> **EtherGem** <:ethergem:490221755756183554>'
        +'\n\n***1:*** ' + `@${gas[0]}` + ' ***-*** ' + '`' + `${gas[gas[0]]}` + ' EGEM`'
        +'\n***2:***  ' + `@${gas[1]}` + ' ***-*** ' + '`' + `${gas[gas[1]]}` + ' EGEM`'
        +'\n***3:***  ' + `@${gas[2]}` + ' ***-*** ' + '`' + `${gas[gas[2]]}` + ' EGEM`'
        +'\n***4:***  ' + `@${gas[3]}` + ' ***-*** ' + '`' + `${gas[gas[3]]}` + ' EGEM`'
        +'\n***5:***  ' + `@${gas[4]}` + ' ***-*** ' + '`' + `${gas[gas[4]]}` + ' EGEM`'

        +'\n\n<:validity:490221401232506882> **Validity** <:validity:490221401232506882>'
        +'\n\n***1:***  ' + `@${token[0]}` + ' ***-*** ' + '`' + `${token[token[0]]}` + ' VLDY`'
        +'\n***2:***  ' + `@${token[1]}` + ' ***-*** ' + '`' + `${token[token[1]]}` + ' VLDY`'
        +'\n***3:***  ' + `@${token[2]}` + ' ***-*** ' + '`' + `${token[token[2]]}` + ' VLDY`'
        +'\n***4:***  ' + `@${token[3]}` + ' ***-*** ' + '`' + `${token[token[3]]}` + ' VLDY`'
        +'\n***5:***  ' + `@${token[4]}` + ' ***-*** ' + '`' + `${token[token[4]]}` + ' VLDY`'
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
                  .setColor(prefixColors[Math.floor(Math.random() * prefixColors.length)])
                  .setDescription(
                    `<@!${_msg.author.id}> tipped `+
                    `${inputParameters[0]} of ` + ' `'
                    + `${inputParameters[1]} ${inputParameters[2]}` + ' `' +  ' 🎉'
                  )
                  .setURL(`https://blockchain.egem.io/txes?input=${tx}`)
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
                    .setColor(prefixColors[Math.floor(Math.random() * prefixColors.length)])
                    .setDescription(
                      `<@!${_msg.author.id}> rained `
                      + `${finalParse}` + ` of ` + ' `' + `${inputParameters[0]} `
                      +`${inputParameters[1]}` + ' `' +  '💥'
                    )
                    .setURL(`https://blockchain.egem.io/txes?input=${rainedUsers.tx}`)
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
    return _msg.channel.send("⚠️  Incorrect EtherGem address");
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
                  .setColor(prefixColors[Math.floor(Math.random() * prefixColors.length)])
                  .setDescription(
                    `<@!${_msg.author.id}> withdrew to ` + ' `'
                    + `${inputParameters[0]}` + '`' +  ' of ' + ' `'
                    + `${inputParameters[1]} ${inputParameters[2]}`
                    + ' `' +  ' 📤')
                    .setURL(`https://blockchain.egem.io/txes?input=${tx}`)
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
      .setColor(prefixColors[Math.floor(Math.random() * prefixColors.length)])
      .setDescription(
      `<:ethergem:490221755756183554> ` + '`' + `${gas[_msg.author.username]} EGEM `  + '`'
      + `\n <:validity:490221401232506882> `  + '`' + `${token[_msg.author.username]} VLDY`  + '`')
      .setAuthor(`⭐ ${_msg.author.username}'s stats`, _msg.author.displayAvatarURL)
  return _msg.channel.send({ embed });
}

commandOveriew = async(_msg) => {
  const embed = new Discord.RichEmbed()
      .setColor(prefixColors[Math.floor(Math.random() * prefixColors.length)])
      .setDescription(
        '\n***Withdraw:*** `/withdraw <address> <amount> <asset>`'
        +'\n***Tip:*** `/tip <user> <amount> <asset>`'
        +'\n***Rain***: `/rain <amount> <asset>`'
        +'\n***Leaderboard:*** `/leaderboard`'
        +'\n***Generate:*** `/generate`'
        +'\n***Deposit:*** `/deposit`'
        +'\n***Balance:*** `/balance`'
        +'\n***Stats:*** `/stats`'
        +'\n***About:*** `/about`'
        +'\n***Help:*** `/help`')
      .setAuthor("🛠️ Commands")
  return _msg.channel.send({ embed });
}

commandHelp= async(_msg) => {
  const embed = new Discord.RichEmbed()
      .setColor(prefixColors[Math.floor(Math.random() * prefixColors.length)])
      .setDescription(helpInfo)
      .setAuthor("⭐️ Help")
  return _msg.channel.send({ embed });
}

commandAbout= async(_msg) => {
  const embed = new Discord.RichEmbed()
      .setColor(prefixColors[Math.floor(Math.random() * prefixColors.length)])
      .setDescription(aboutInfo)
      .setAuthor("🔍 About")
  return _msg.channel.send({ embed });
}

commandApprove= async(_msg) => {
  var callingUser = _msg.author.username;
  var calling0x = await wallet.proofAccount(callingUser);

  if(await wallet.isAddress(calling0x) == true){
     var tx = await wallet.approveTokens(calling0x);
     if(tx != undefined){
       const embed = new Discord.RichEmbed()
           .setTitle("🔗 Transaction")
           .setColor(prefixColors[Math.floor(Math.random() * prefixColors.length)])
           .setDescription('Successfully approved')
           .setURL(`https://blockchain.egem.io/txes?input=${tx}`)
       return _msg.channel.send({ embed });
     } else {
       return _msg.channel.send('⚠️ Error could not approve');
     }
  } else {
    return _msg.channel.send(calling0x);
  }
}

commandReset = async(_msg) => {
  var callingUser = _msg.author.username;
  var calling0x = await wallet.proofAccount(callingUser);

  if(await wallet.isAddress(calling0x) == true){
     var tx = await wallet.resetApprove(calling0x);
     if(tx != undefined){
       const embed = new Discord.RichEmbed()
           .setTitle("🔗 Transaction")
           .setColor(prefixColors[Math.floor(Math.random() * prefixColors.length)])
           .setDescription('Successfully reset')
           .setURL(`https://blockchain.egem.io/txes?input=${tx}`)
       return _msg.channel.send({ embed });
     } else {
       return _msg.channel.send('⚠️ Error could not reset ');
     }
  } else {
    return _msg.channel.send(calling0x);
  }
}

client.on('message', async(msg) => {

  if(msg.content === '/generate') {
    if(await commandLimit(msg.author.id) == true){
    await wallet.logCall(msg.author.id);
    return commandGenerate(msg);
    }
  } else if(msg.content === '/balance') {
    if(await commandLimit(msg.author.id) == true){
    await wallet.logCall(msg.author.id);
    return commandBalance(msg);
    }
  } else if(msg.content === '/leaderboard') {
    if(await commandLimit(msg.author.id) == true){
    await wallet.logCall(msg.author.id);
    return commandLeaderboard(msg);
    }
  } else if(msg.content === '/deposit') {
    if(await commandLimit(msg.author.id) == true){
    await wallet.logCall(msg.author.id);
    return commandDeposit(msg);
    }
  } else if(msg.content.split(" ")[0] === '/tip') {
    if(await commandLimit(msg.author.id) == true){
    await wallet.logCall(msg.author.id);
    return commandTip(msg);
    }
  } else if(msg.content.split(" ")[0] === '/rain') {
    if(await commandLimit(msg.author.id) == true){
    await wallet.logCall(msg.author.id);
    return commandRain(msg);
    }
  } else if(msg.content.split(" ")[0] === '/withdraw') {
    if(await commandLimit(msg.author.id) == true){
    await wallet.logCall(msg.author.id);
    return commandWithdraw(msg);
    }
  }  else if(msg.content === '/stats') {
    if(await commandLimit(msg.author.id) == true){
    await wallet.logCall(msg.author.id);
    return commandStats(msg);
    }
  } else if(msg.content === '/help') {
    if(await commandLimit(msg.author.id) == true){
    await wallet.logCall(msg.author.id);
    return commandHelp(msg);
    }
  } else if(msg.content === '/commands') {
    if(await commandLimit(msg.author.id) == true){
    await wallet.logCall(msg.author.id);
    return commandOveriew(msg);
    }
  } else if(msg.content === '/about') {
    if(await commandLimit(msg.author.id) == true){
    await wallet.logCall(msg.author.id);
    return commandAbout(msg);
    }
  } else if(msg.content === '/approve') {
    if(await commandLimit(msg.author.id) == true){
    await wallet.logCall(msg.author.id);
    return commandApprove(msg);
    }
  } else if(msg.content === '/reset') {
    if(await commandLimit(msg.author.id) == true){
    await wallet.logCall(msg.author.id);
    return commandReset(msg);
    }
  } else if(msg.content === '/admin') {
    if(await commandLimit(msg.author.id) == true){
    await wallet.logCall(msg.author.id);
    return msg.channel.send(randomAdmin[Math.floor(Math.random() * randomAdmin.length)])
    }
  } else if(msg.content === '/facts') {
    if(await commandLimit(msg.author.id) == true){
    await wallet.logCall(msg.author.id);
    return msg.channel.send(randomFacts[Math.floor(Math.random() * randomFacts.length)])
    }
  } else if(msg.content === '/praise') {
    if(await commandLimit(msg.author.id) == true){
    await wallet.logCall(msg.author.id);
    return msg.channel.send(randomPraise[Math.floor(Math.random() * randomPraise.length)])
    }
  }

});

}
