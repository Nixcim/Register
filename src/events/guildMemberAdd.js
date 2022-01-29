const { guildTags, guildDiscriminator, guildRulesChannel, entryExitChannel, tagLog, registration, unregister, quarantine } = global.client.guildSettings;
const { familyRole, staffs } = registration;
const { unregisterChannel, unregisterRole, unregisterName } = unregister;
const { quarantineRole, quarantineName, quarantineLog, quarantineDateLimit } = quarantine;
const { mark, cross, success, rules, tada } = require('../configs/emojis.json');
const penals = require('../schemas/penals.js');
const embed = require('../utils/Embed.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

/**
 * @param { GuildMember } member 
 */

module.exports = async (member) => {

    let Embed = embed(false, false);
    let penal = await penals.findOne({ guildID: member.guild.id, userID: member.id, type: 'JAIL', active: true }) || await penals.findOne({ guildID: member.guild.id, userID: member.id, type: 'TEMP-JAIL', active: true });
    let accountCreatedDate = moment(member.user.createdTimestamp).format('DD MMMM YYYY (HH:mm)');
    let accountCreatedDate2 = client.getTime(Date.now() - member.user.createdTimestamp);
    let security = await client.checkSecurity(member.user, quarantineDateLimit);
    let rulesChannel = member.guild.channels.cache.get(guildRulesChannel);
    let welcomeChannel = member.guild.channels.cache.get(unregisterChannel);
    let staffsRole = member.guild.roles.cache.get(staffs[0]);
    let log = member.guild.channels.cache.get(entryExitChannel);
    let qLog = member.guild.channels.cache.get(quarantineLog);

    if(welcomeChannel) welcomeChannel.wsend(`
${tada ? tada : '🎉'} Sunucumuza Hoş Geldin ${member.toString()}

${security ? (mark ? `${mark} ` : ``) : (cross ? `${cross} ` : ``)}Hesabın **${accountCreatedDate}** tarihinde (\`${accountCreatedDate2} önce\`) oluşturulmuş!

${rules ? rules : ``} Sunucu kurallarımız ${rulesChannel ? rulesChannel.toString() : `#kurallar`} kanalında belirtilmiştir. Sunucu içerisinde ki ceza işlemleri kuralları okuduğun varsayılarak gerçekleştirilecektir.

${success ? `${success} ` : ``} Sunucumuzun **${member.guild.memberCount}.** üyesisin. ${(guildTags.length && guildTags.length == 1 && !guildDiscriminator) || (guildDiscriminator && !guildTags.length) ? `Tagımızı (\`${guildTags.length ? guildTags[0] : `#${guildDiscriminator}`}\`)` : (guildTags.length && guildTags.length > 1) || (guildTags.length && guildDiscriminator) ? `Taglarımızdan (${guildTags.map(tag => `\`${tag}\``).join(' , ')}${guildDiscriminator ? ` , \`#${guildDiscriminator}\`` : ``}) birini` : `Tagımızı`} alarak bizlere destek ola bilirsin!

${security ? ` Sunucu odalarını görebilmek için "V.Confirmed" odalarında yetkililerimize isim yaş belirtmelisin.` : `**Maalesef, hesabın yakın bir zamanda açıldığı için sunucumuza kayıt olamazsın!**`}
    `, { name: 'Welcome To Server', avatar: client.user.avatarURL() });

    if(log) log.send(`**${member.user.tag}** (\`${member.id}\`) adlı kullanıcı sunucuya katıldı ve üye sayısı **${member.guild.memberCount}** kişiye ulaştı!`);
    if((guildTags.length && guildTags.some(tag => member.user.username.includes(tag))) || (guildDiscriminator && member.user.discriminator == guildDiscriminator)) {

        let tLog = member.guild.channels.cache.get(tagLog);
        member.user.send(`**${member.guild.name}** adlı sunucumuzun tagını kullanıcı isminde bulundurarak bize destek olduğun için teşekkür ederiz. Sunucumuza Tekrar Hoş Geldin!`).catch(() => {});

        if(familyRole) member.roles.add(familyRole);
        if(tLog) tLog.send(Embed.setFooter('').setDescription(`${member.toString()} kullanıcısı sunucuya taglı olarak katıldı${familyRole && member.guild.roles.cache.has(familyRole) ? ` ve üyeye ${member.guild.roles.cache.get(familyRole).toString()} rolü verildi!` : `!`}`))

    };
    if(!penal && security && unregisterRole) member.roles.add(unregisterRole);
    if(security && unregisterName) member.setNickname(unregisterName);
    else if(!security) {

        if(quarantineRole) member.roles.add(quarantineRole);
        if(quarantineName) member.setNickname(quarantineName);
        if(qLog) qLog.send(`**${member.user.tag}** (\`${member.id}\`) adlı kullanıcı sunucuya katıldı ama hesabı yakın bir zamanda açıldığı için karantinaya alındı!`);
        member.user.send(`Merhaba ${member.toString()}, **${member.guild.name}** adlı sunucumuza hoş geldin. Görünüşe göre hesabın yakın bir zamanda açılmış, bu sebeple sunucu güvenliğini korumak için karantinaya alındın!`).catch(() => {});

    };

};

module.exports.conf = {
    name: 'Guild Member Add',
    event: 'guildMemberAdd',
};
