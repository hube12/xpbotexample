const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const xp = require('./xp.json');
const fs = require('fs');
var messageCounter = 0;

client.on('ready', () => {
    console.log('Ready!');
    console.log(client.guilds.map(g => g.name).join("\n"));
});

client.on("guildCreate", guild => {
    console.log("Someone added my test bot, server named: " + guild.name + " and their name was: " + guild.owner.user.username)
});

client.on('message', message => {
    //if a bot return
    if (message.author.bot) return;
    //if it is a DM
    if (message.channel.type=="dm") return;
    //if the command !xp is triggered
    if (message.content.startsWith('!xp')) {
        //if there is a mention after that command use that
        if (message.mentions.users.first()) {
            //check if the value exist
            if (xp[message.mentions.users.first().id]) {
                message.channel.send(xp[message.mentions.users.first().id].xp)
            }
            else {
                message.channel.send("Sorry No Data")
            }
        }
        //else use the client that started teh request
        else if (xp[message.member.id]) {
            message.channel.send(xp[message.member.id].xp)
        }
        else {
            message.channel.send("Sorry No Data")
        }
    }
    //if the user exist increment counter
    if (xp[message.member.id]) {
        xp[message.member.id].xp += 1
        messageCounter++;
    }
    //else create the user
    else {
        xp[message.member.id] = {
            xp: 0
        }
    }
    //debug statement
    console.log(JSON.stringify(xp))
    console.log(message.member.id+" just gained some xp")
    //if we achieve 100 message then its time to save up
    if (messageCounter == 100) {
        //we restore the counter
        messageCounter = 0
        //we stringify the object and write it to the xp.json
        let data = JSON.stringify(xp);
        fs.writeFile('xp.json', data, (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
    }
});
client.login(auth.token)