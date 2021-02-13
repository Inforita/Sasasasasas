const { Collection, Client } = require("discord.js");
const ayarlar = require('./ayarlar.json');
const Database = require("./Helpers/Database");
const client = new Client;


const Invites = new Collection(); //pythonic

client.on("ready", () => {//pythonic
    client.guilds.cache.forEach(guild => {//pythonic
        guild.fetchInvites().then(_invites => {//pythonic
            Invites.set(guild.id, _invites);//pythonic
        }).catch(err => { });//pythonic
    });
});
client.on("inviteCreate", (invite) => {
    var gi = Invites.get(invite.guild.id);//pythonic
    gi.set(invite.code, invite);
    Invites.set(invite.guild.id, gi);//pythonic
});
client.on("inviteDelete", (invite) => {
    var gi = Invites.get(invite.guild.id);//pythonic
    gi.delete(invite.code);
    Invites.set(invite.guild.id, gi);//pythonic
});


client.on("guildCreate", (guild) => {
	guild.fetchInvites().then(invites => {
		Invites.set(guild.id, invites);
	}).catch(e => {})//pythonic
});

//pythonic
client.on("guildMemberAdd", (member) => {
    //const gi = new Collection().concat(Invites.get(member.guild.id));
    const db = new Database("./Servers/" + member.guild.id, "Invites"), gi = (Invites.get(member.guild.id) || new Collection()).clone(), settings = new Database("./Servers/" + member.guild.id, "Settings").get("settings") || {};//pythonic
     if (member.guild.id !== "789594275221340251") return; //sunucu ıd
     const qq = require("moment");
  let userinfo = {};
  userinfo.dctarih = qq.utc(member.user.createdAt).format("DD MMMM YYYY, dddd  hh:mm:ss")
    .replace("Monday", `Pazartesi`)
    .replace("Tuesday", `Salı`)
    .replace("Wednesday", `Çarşamba`)
    .replace("Thursday", `Perşembe`)
    .replace("Friday", `Cuma`)
    .replace("Saturday", `Cumartesi`)
    .replace("Sunday", `Pazar`)
    .replace("January", `Ocak`)
    .replace("February", `Şubat`)
    .replace("March", `Mart`)
    .replace("April", `Nisan`)
    .replace("May", `Mayıs`)
    .replace("June", `Haziran`)
    .replace("July", `Temmuz`)
    .replace("August", `Ağustos`)
    .replace("September", `Eylül`)
    .replace("October", `Ekim`)
    .replace("November", `Kasım`)
    .replace("December", `Aralık`);
    var guild = member.guild, fake = (Date.now() - member.createdAt) / (1000 * 60 * 60 * 24) <= 3 ? true : false, channel = guild.channels.cache.get(settings.Channel);//pythonic
    guild.fetchInvites().then(invites => {
        // var invite = invites.find(_i => gi.has(_i.code) && gi.get(_i.code).maxUses != 1 && gi.get(_i.code).uses < _i.uses) || gi.find(_i => !invites.has(_i.code)) || guild.vanityURLCode;
        var invite = invites.find(_i => gi.has(_i.code) && gi.get(_i.code).uses < _i.uses) || gi.find(_i => !invites.has(_i.code)) || guild.vanityURLCode;
        Invites.set(member.guild.id, invites);
        var content = `${member} is joined the server.`, total = 0, regular = 0, _fake = 0, bonus = 0;
        if(invite == guild.vanityURLCode) content = settings.defaultMessage ? settings.defaultMessage : `-member- katıldı! **davet eden** -target- (<a:caps_tik:791323874901753871> -total- )`;//pythonic
        else content = settings.welcomeMessage ? settings.welcomeMessage : `The -member-, joined the server using the invitation of the -target-.`;//pythonic

        if (invite.inviter) { 
            db.set(`invites.${member.id}.inviter`, invite.inviter.id); 
            if(fake){
                total = db.add(`invites.${invite.inviter.id}.total`, 1);
                _fake = db.add(`invites.${invite.inviter.id}.fake`, 1);
            }
            else{
                total = db.add(`invites.${invite.inviter.id}.total`, 1);
                regular = db.add(`invites.${invite.inviter.id}.regular`, 1);
            }
            var im = guild.member(invite.inviter.id);
            bonus = db.get(`invites.${invite.inviter.id}.bonus`) || 0;
            if(im) global.onUpdateInvite(im, guild.id, Number(total + Number(bonus)));
            
        }


        db.set(`invites.${member.id}.isfake`, fake);

        if(channel){
       channel.send(`<a:capsmeme:809529986805137458> **Sunucumuza hoş geldin** **${member}**

          <a:capsmeme:809529986805137458> **Discord'a katılım tarihin** **__${userinfo.dctarih}__**

               <a:capsmeme:809529986805137458> **Kayıt olmadan önce <#796841236697972736> kanalında kuralları okumanı tavsiye ederim.**

               <a:capsmeme:809529986805137458> **Tagımızı alarak bize destek olabilirsin .tag yazarak tagımızı öğrenebilirsin.**

          <a:capsmeme:809529986805137458> ${invite.inviter} **${total + bonus}**. **davetini gerçekleştirerek sunucumuzun** **${member.guild.memberCount}** **kişi olmasını sağladı.**

 <a:capsmeme:809529986805137458> **İyi eğlenceler,keyifli vakit geçirmen dileğiyle.**`)
        }
    }).catch();
});




global.onUpdateInvite = (guildMember, guild, total) => {
    if(!guildMember.manageable) return;
    const rewards = new Database("./Servers/" + guild, "Rewards").get("rewards") || [];//pythonic
    if(rewards.length <= 0) return;
    var taken = rewards.filter(reward => reward.Invite > total && guildMember.roles.cache.has(reward.Id));//pythonic
    taken.forEach(take => {
        guildMember.roles.remove(take.Id);
    });
    var possible = rewards.filter(reward => reward.Invite <= total && !guildMember.roles.cache.has(reward.Id));//pythonic
    possible.forEach(pos =>{
        guildMember.roles.add(pos.Id);
    });
}



client.login(process.env.token)