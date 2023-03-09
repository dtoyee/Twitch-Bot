const tmi = require('tmi.js')
const { channel, username, password } = require('./settings.json')

const client = new tmi.client({
    option: { debug: true },
    identity: {
        username: username,
        password: password,
    },
    channels: [channel]
})

const bannedWords = [
    'apple'
]

try {
    client.connect()
    console.log("Bot logged in")
} catch (error) {
    console.log(error)
}

client.on('message', (channel, user, message, self) => {
    checkSentMessage(user, message, user.id, channel)
    if(self || !message.startsWith('!')) return

    const args = message.slice(1).split(' ')
    const command = args.shift().toLowerCase()
    let isBroadcaster = channel.slice('1') === user.username
    let isMod = user.mod || user['user-type'] === 'mod'
    let modUp = isBroadcaster || isMod

    if(command === 'ping') {
        client.say(channel, `@${user.username} pong`)
    } else if(command === 'quote') {
        getQuote(user)
    } else if(command === 'number') {
        if(!isNaN(args[0])) {
            client.say(channel, `@${user.username}, ${Math.floor(Math.random() * args[0]) + 1}`)
        } else {
            client.say(channel, `@${user.username}, I need an end number.`)
        }
    } else if(command === "fact") {
        randomFact(user)
    } else if(command === "rps") {
        rockPaperSisscors(user, args[0])
    } else if(command == "links") {
        client.say(channel, "Twitter: twitter Instagram: instagram Facebook: facebook YouTube: youtube Steam: steam")
    } else if(command == "twitter") {
        client.say(channel, "Twitter: twitter")
    } else if(command == "instagram") {
        client.say(channel, "Instagram: instagram")
    } else if(command == "facebook") {
        client.say(channel, "Facebook: facebook")
    } else if(command == "youtube") {
        client.say(channel, "YouTube: youtube")
    } else if(command == "steam") {
        client.say(channel, "Steam: steam")
    } else if(command == "emoteonly") {
        client.emoteonly(channel).catch((err) => console.log(err))
    } else if(command == "emoteonlyoff") {
        client.emoteonlyoff(channel).catch((err) => console.log(err))
    } else if(command == "followersonly") {
        client.followersonly(channel).catch((err) => console.log(err))
    } else if(command == "followersonlyoff") {
        client.followersonlyoff(channel).catch((err) => console.log(err))
    }
})

async function getQuote(user) {
    await fetch('https://zenquotes.io/api/random')
    .then(response => response.json())
    .then(data => {
        client.say(channel, `@${user.username} ${data[0].q} - ${data[0].a}`)
    })
}

async function randomFact(user) {
    await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random")
    .then(response => response.json())
    .then(data => {
        client.say(channel, `${data['text']}`)
    })
}

function rockPaperSisscors(user, userChoice) {
    const options = ["rock", "paper", "scissors"]
    const botChoice = options[Math.floor(Math.random() * options.length)]
    let usersChoice = userChoice
    if(usersChoice == "rock" && botChoice == "paper") {
        client.say(channel, `Unlucky, @${user.username}! I win this time! Paper beats rock.`)
    } else if(usersChoice == "rock" && botChoice == "scissors") {
        client.say(channel, `You beat me, @${user.username}! Rock beats scissors.`)
    } else if(usersChoice == "rock" && botChoice == "rock") {
        client.say(channel, `@${user.username} draw!`)
    } else if(usersChoice == "paper" && botChoice == "rock") {
        client.say(channel, `You beat me, @${user.username}! Paper beats rock.`)
    } else if(usersChoice == "paper" && botChoice == "paper") {
        client.say(channel, `@${user.username} draw!`)
    } else if(usersChoice == "paper" && botChoice == "scissors") {
        client.say(channel, `Unlucky, @${user.username}! I win this time! Scissors beats paper.`)
    } else if(usersChoice == "scissors" && botChoice == "rock") {
        client.say(channel, `Unlucky, @${user.username}! I win this time! Rock beats scissors.`)
    } else if(usersChoice == "scissors" && botChoice == "paper") {
        client.say(channel, `You beat me, @${user.username}! Scissors beats paper.`)
    } else if(usersChoice == "scissors" && botChoice == "scissors") {
        client.say(channel, `@${user.username} draw!`)
    }
}

function checkSentMessage(user, message, messageId, channel) {
    let sendMessage = false
    sendMessage = bannedWords.some(blockedWord => message.includes(blockedWord.toLowerCase()))

    if(sendMessage) {
        client.say(channel, `@${user.username}, sorry! Your message contained a banned word.`)
        client.deletemessage(channel, messageId).catch((err) => console.log("Error!", err))
    }
}