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
  'Skeet skeet',
  'FIAT CREW',
  'BitCorn',
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
  'YURT',
  'YARP',
  'HODL',
  'pl0x'
];

const randomFacts = [
  `There is a collective of miners utilising their combined hashpower to crack every existing Bitcoin private key using brute force, known as the Large Bitcoin Collider`,
  `In the year 2017, 81% of all ICO's were amoral or inaffective, which resulted up to €300,0000,000 lost`,
  'A high TPS (Transactions per second) throughput, unfortunately means there is cost to decentralisation',
  `ICOBench has a pay-per-review tiered system, with the more you bid the better the rating you get`,
  `There is over 32 BTC to be won, if one can solve Satoshi's puzzle transactions`,
  'The majority of TRX dApps only orientate towards on gambling use-cases',
  'Approximately 61% of the EOS supply resides in 100 addresses',
  'Over 80% of the tops pairs on CMC are washedtraded'
];

const commandList =
   '⚒ ***Commands*** ⚒'
   +'\n\n***Withdraw:*** `/withdraw <address> <amount> <asset>`'
   +'\n***Tip:*** `/tip <amount> <user> <asset>`'
   +'\n***Rain***: `/rain <amount> <asset>`'
   +'\n***Approve***: `/approve <amount>`'
   +'\n***Leaderboard:*** `/leaderboard`'
   +'\n***Validation:*** `/validation`'
   +'\n***Allowance:*** `/allowance`'
   +'\n***Generate:*** `/generate`'
   +'\n***Deposit:*** `/deposit`'
   +'\n***Balance:*** `/balance`'
   +'\n***Stats:*** `/stats`'
   +'\n***Menu:*** `/start`'
   +'\n***Help:*** `/help`';


const helpInfo =
    '⭐️ ***Help*** ⭐️'
    +'\n\n`Command parameters`'
    +'\n`<user>` - An active telegram username, eg: @xGozzy'
    +'\n`<amount>` - The amount one wishes to tip, eg: `100`'
    +'\n`<asset>` - The asset one wishes to tip, eg: `ETH` or `VLDY`'
    +'\n`<address>` - The address one wishes to withdraw to, eg:`0xA5d505F9EfA7aFC13C82C1e87E12F0562A5ed78f`'
    +'\n\n`Command format`'
    +'\nIn order to execute transactional based operations corrrectly, one must follow the format of the specified command.'
    +' If we look at our tip function we can see that it requires 3 parameters, an amount, a user and the chosen asset:'
    +'\n`/tip <user> <amount> <asset>`'
    +'\nIf we were to actually fill in the parameters it would look like so:'
    +'\n`/tip @xGozzy 1 ETH`'
    +'\n\nIf one was to use the rain command which format is declared as:'
    +'\n`/rain <amount> <asset>`'
    +'\nIt would be called as so:'
    +'\n`/rain 100 VLDY`'
    +'\n\nThen finally the withdraw command:'
    +'\n`/withdraw <address> <amount> <asset>`'
    +'\nWould look like:'
    +'\n`/withdraw 0xA5d505F9EfA7aFC13C82C1e87E12F0562A5ed78f 1 ETH`'
    +'\n\n`Fees and gas dependency`'
    +'\nIn order to send transactions, one must have a ETH balance to pay compensation for the transaction fee.'
    +' This means one cannot tip VLDY without an active ETH balance.'
    +'\n\nAs this bot is not funded, there will be a fee implementation of ***1 ETH per tip*** in order to allow it be'
    +' hosted on a virtual machine for 24/7 uptime and swift responses. A % of the fees will be split among the core team'
    +' and a % will be isolated for community events.'
    +'\n\n`Security disclaimer`'
    +'\nThis bot is ***centralised*** and is not ultimately secure for storing large amount of assets, please use an associated'
    +' Ethereum wallet to store your funds securely: \nhttps://myetherwallet.com/'
    +'\n\n`Users must take it into their own responsibilities to withdraw their'
    +' own balances frequently. The Validity team is not responsibile for any losses.`'
    +'\n\n`Source Code`'
    +'\nThis bot was developed by @xGozzy on behalf of @ValidityCrypto, to incentivize community events and activity but'
    +' also to allow seamless tips between the team and community members. It will be updated regularly to ensure maximum'
    +' efficency and security. View the source code at:'
    +' https://github.com/validitycrypto/validity-hybrid-tipbot';

    const aboutInfo1 =
        '\n`Command parameters`'
        +'\n`<user>` - An active telegram username, eg: @xGozzy'
        +'\n`<amount>` - The amount one wishes to tip, eg: `100`'
        +'\n`<asset>` - The asset one wishes to tip, eg: `ETH` or `VLDY`'
        +'\n`<address>` - The address one wishes to withdraw to, eg:`0xA5d505F9EfA7aFC13C82C1e87E12F0562A5ed78f`'
        +'\n\n`Command format`'
        +'\nIn order to execute transactional based operations corrrectly, one must follow the format of the specified command.'
        +' If we look at our tip function we can see that it requires 3 parameters, an amount, a user and the chosen asset:'
        +'\n`/tip <user> <amount> <asset>`'
        +'\nIf we were to actually fill in the parameters it would look like so:'
        +'\n`/tip @xGozzy 1 ETH`'
        +'\n\nIf one was to use the rain command which format is declared as:'
        +'\n`/rain <amount> <asset>`'
        +'\nIt would be called as so:'
        +'\n`/rain 100 VLDY`'
        +'\n\nThen finally the withdraw command:'
        +'\n`/withdraw <address> <amount> <asset>`'
        +'\nWould look like:'
        +'\n`/withdraw 0xA5d505F9EfA7aFC13C82C1e87E12F0562A5ed78f 1 ETH`'

    const aboutInfo2 =
        '\n`Fees and gas dependency`'
        +'\nIn order to send transactions, one must have a ETH balance to pay compensation for the transaction fee.'
        +' This means one cannot tip VLDY without an active ETH balance.'
        +'\n\nAs this bot is not funded, there will be a fee implementation of ***1 ETH per tip*** in order to allow it be'
        +' hosted on a virtual machine for 24/7 uptime and swift responses. A % of the fees will be split among the core team'
        +' and a % will be isolated for community events.'
        +'\n\n`Security disclaimer`'
        +'\nThis bot is ***centralised*** and is not ultimately secure for storing large amount of assets, please use an associated'
        +' Ethereum wallet to store your funds securely: \nhttps://myetherwallet.com/'
        +'\n\n`Users must take it into their own responsibilities to withdraw their'
        +' own balances frequently. The Validity team is not responsibile for any losses.`'
        +'\n\n`Source Code`'
        +'\nThis bot was developed by @xGozzy on behalf of @ValidityCrypto, to incentivize community events and activity but'
        +' also to allow seamless tips between the team and community members. It will be updated regularly to ensure maximum'
        +' efficency and security. View the source code at:'
        +' https://github.com/validitycrypto/validity-hybrid-tipbot';

const validationInfo = (_embed) =>
`\n***${_embed.eventName}*** $${_embed.eventTicker}`
+`\n\n📍${_embed.eventType} ` + `🎲 ${_embed.eventRound}`
+`\n👥 Participants: ${_embed.eventParticipants} `

+ `\n\n🌟Positive: ***${_embed.eventPositive}*** `
+ `\n🔸Neutral: ***${_embed.eventNeutral}*** `
+ `\n🔺Negative: ***${_embed.eventNegative}*** `


module.exports = { validationInfo, randomPraise, randomFacts, randomAdmin, commandList, helpInfo, aboutInfo1, aboutInfo2, prefixColors }
