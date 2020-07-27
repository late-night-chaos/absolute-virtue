const token = 'TOKEN_GOES_HERE';

const Discord = require('discord.js');
const client = new Discord.Client();

function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}
function getServerTime(targetTime) {
    let currentDate = new Date();
    if (typeof targetTime !== 'undefined') {
        currentDate.setTime(targetTime);
    }
    return addZero(currentDate.getUTCHours()) + ':' + addZero(currentDate.getUTCMinutes()) + ' ST';
}
function getEorzeanTime(targetTime) {
    //Number of Eorzean Days in an Earth Day
    let currentDate = new Date();
    if (typeof targetTime !== 'undefined') {
        currentDate.setTime(targetTime);
    }
    let eorzeanTime = Math.floor(currentDate.getTime() * eorzeanTimeFactor);
    let eorzeanDate = new Date();
    eorzeanDate.setTime(eorzeanTime);
    return addZero(eorzeanDate.getUTCHours()) + ':' + addZero(eorzeanDate.getUTCMinutes()) + ' ET';
}

//The Interval Loop
function clockFunctions() {
    let currentDate = new Date();
    if (client.ws.status === 0) {
        //Things inside the interval loop should only run when the bot is actually connected to Discord
        client.user.setActivity('at ' + getServerTime()); //Set bot status
    }
    let Interval = (60 - currentDate.getUTCSeconds()) * 1000 + 5;
    //The interval loop occurs on the minute every minute,
    //so we subtract the current number of seconds to get that start time.
    setTimeout(clockFunctions, Interval);
}
clockFunctions();

client.on('message', (msg) => {
    if (msg.author.bot) return; //Don't allow bots to trigger commands
    if (msg.content.substring(0, 1) !== '!') return; //If the message doesn't have the command prefix, don't process.
    const arguments = msg.content.slice(1).trim().split(/ +/g); //Break up the command by words as arguments
    const command = arguments.shift().toLowerCase(); //Remove the command from the arguments, save it as 'command'
    if (command === 'eorzeatime' || command === 'eorzeantime') {
        msg.reply(`It is currently ${getEorzeanTime()}`).catch((error) => console.log(error));
    }
    if (command === 'servertime') {
        msg.reply(`It is currently ${getServerTime()}`).catch((error) => console.log(error));
    }
});

client.login(token);
