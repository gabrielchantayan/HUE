const Discord = require('discord.js');
const bot = new Discord.Client();
var fs = require("fs");
var config = require("./config.json");
var huesF = require("./hues.json");

const prefix = "c.";
const token = config["token"];

var hues = huesF;

var indexes = {};
var intervals = {};
var stopped = [];

function buildIndex(role) {
    indexes[role] = 0;
    console.log('Built index for ' + hues[role]["roleName"] + '. Size: ' + hues[role]["colors"].length);
}

function changeColor(role) {
    for (gui in bot.guilds.array()) {
        if (!(stopped.includes(bot.guilds.array()[gui].id))) {
        try {
            bot.guilds.get(bot.guilds.array()[gui].id).roles.find(x => x.name == hues[role]["roleName"]).setColor(hues[role]["colors"][indexes[role]])
                .catch(console.error);
            if (indexes[role] == (hues[role]["colors"].length - 1)) {
                indexes[role] = 0;
            } else {
                indexes[role]++;
            }
        } catch (e) { }
        } else {
        }
    }
}

function setIntervals(role) {
    intervals[role] = setInterval( function() { changeColor(role); }, hues[role]["timings"]);
}



// On Ready
bot.on('ready', () => {
    console.log("\n\n\n\n#==============================#");
    console.log('Logged in as ' + bot.user.username);
    console.log(bot.user.id);
    console.log("Prefix set to " + config["prefix"]);
    bot.user.setActivity('c.help');
    // try {
    //     bot.user.setAvatar("./avatar.png");
    //     console.log("Set avatar successfuly!");
    // } catch (e) {
    //     console.log("Error setting avatar :(");
    // }
    console.log("#==============================#\n\n");

    for (i = 0; i < Object.keys(hues).length; i++) {
        buildIndex(i);
        setIntervals(i);
    }

});

// Messages
bot.on('message', message => {
    if (message.author.bot) return;
    if (message.content.substring(0, 2) != prefix) return;
    let user = message.author;
    let command = message.content.split(" ")[0].slice(2).toLowerCase();
    let args = message.content.split(" ").slice(1);


    if (message.guild == null) {
        message.author.send("Sorry, but commands can't be used in DMs   :(")
    } else {

        // Log the message
        var date = new Date();
        var timestamp = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        console.log(timestamp + " (" + message.guild.name + ") " + user.username + ": " + message.content);

        if (command == "invite") {
            message.channel.send(`Here's your invite${user}!\nhttps://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=268502016`)
        }

        else if (command == "stop"){
            if (message.guild.member(message.author).hasPermission('MANAGE_ROLES')){
                if (stopped.indexOf(message.guild.id) <= -1) { stopped.push(message.guild.id); }
                console.log(stopped)
                message.channel.send("Stopped HUE");
            }
        }

        else if (command == "resume"){
            if (message.guild.member(message.author).hasPermission('MANAGE_ROLES')){
                if (stopped.indexOf(message.guild.id) > -1) { stopped.splice(stopped.indexOf(message.guild.id), 1); }
                message.channel.send("Resumed HUE");
            }
        }

        else if (command == "hues") {
            msg = "**Avalible hues**";
            for (i = 0; i < Object.keys(hues).length; i++) {
                msg += "\n**" + hues[i]["roleName"] + ":** " + hues[i]["description"];
            }
            message.channel.send(msg);
        }

        else if (command == "help") {
            message.channel.send("**Avalible commands:**  `invite`  `stop`  `resume`  `hues`\nTo add a colored tole to your server, just create a new role with a name listed in c.hues\nTo reorder roles, do c.stop");
        }

        else if (command == "reload"){
            if (message.author.id == config["owner"]){
                delete require.cache[require.resolve('./hues.json')];
                huesF = require('./hues.json');
                hues = huesF;
                stopped = [];
                for (i = 0; i < Object.keys(hues).length; i++) {
                    buildIndex(i);
                    setIntervals(i);
                }
                message.channel.send('Reloaded!')
            }
            else {
                message.channel.send('You need to be the bot owner to do that!')
            }
        }

        else if (command == "kill") {
            if (message.author.id == config["owner"]) {
                if (args[0] == "confirm") {
                    message.channel.send('Killing bot...');
                    bot.destroy();
                }
                else {
                    message.channel.send('Type c.kill confirm to confirm kill')
                }
            }
            else {
                message.channel.send('You need to be the bot owner to do that!')
            }
        }

    }


});

bot.on('error', console.error);

// Login
bot.login(token);