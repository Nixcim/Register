const { Client, Collection } = require('discord.js');
const client = (global.client = new Client({ fetchAllMembers: true }));
const { readdirSync } = require('fs');
require('./src/configs/settings.js')(client);
require('./src/handlers/functions.js')(client);
const { Token } = client.settings;

// Collections
client.commands = new Collection();
client.cooldowns = new Collection();

// Handlers
require('./src/handlers/mongoHandler.js');
require('./src/handlers/eventHandler.js');

// Checking Commands
readdirSync('./src/commands').filter(dir => {
	const commandFiles = readdirSync(`./src/commands/${dir}/`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./src/commands/${dir}/${file}`);
		client.commands.set(command.name, command);
		// console.log(`Komutlar - ${command.name} Yüklendi`);
	}
});

// Connecting To Client
client.login(Token).then(() => console.log('Bit bağlantısı başarılı')).catch(() => {
	console.log('Bit bağlantısında bir problem yaşandı');
	process.exit();
});