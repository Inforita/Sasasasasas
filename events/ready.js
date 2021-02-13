const chalk = require('chalk');
const moment = require('moment');
const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');

var prefix = ayarlar.prefix;

module.exports = client => {
client.user.setActivity(`qwe qwe qwe qwe qwe qwe qwe qwe qwe qweq`, {
type: "STREAMING",
url: "https://www.twitch.tv/inforita"})
    .then(presence => console.log(`Your Status has been set to  ${presence.game ? presence.game.none : 'none'}`))
    .catch(console.error);
    
};